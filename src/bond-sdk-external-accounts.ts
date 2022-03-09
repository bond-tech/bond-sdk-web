interface Credentials {
    identity: string;
    authorization: string;
}

interface LinkAccountParams extends Credentials {
    businessId?: string;
    customerId?: string;
    accountId: string;
}

interface MicroDepositParams extends Credentials {
    linkedAccountId: string;
}

interface Payload {
    public_token: string;
    external_account_id: string;
    verification_status: string;
    bank_name: string;
}

type PlaidInsitution = {
    name: string;
    institution_id: string;
};

type PlaidAccount = {
    id: string;
    mask: string;
    name: string;
    subtype: string;
    type: string;
    verification_status: string;
}

type PlaidError = {
    error_type: string;
    error_code: string;
    error_message: string;
    display_message: string;
};

type PlaidSuccessResponse = {
    public_token: string;
    metadata: {
        institution: PlaidInsitution;
        account_id: string;
        account: PlaidAccount;
        link_session_id: string;
        public_token: string;
    };
}

type PlaidExitResponse = {
    // https://plaid.com/docs/link/web/#onexit
    error: PlaidError;
    metadata: {
        institution: PlaidInsitution;
        status: string;
        link_session_id: string;
        request_id: string;
    };
}

interface UpdateExternalAccountPayload {
    new_link_token: boolean;
    verification_status?: string;
}

/**
 * @classdesc Represents the Bond Account Connection SDK. It allows developers to
 * link external bank accounts with existing one.
 * @class
 */
class BondExternalAccounts {
    bondEnv: string;
    plaidEnv: string;
    bondHost: string;

    /**
     * The BondEnvType
     * @typedef {('sandbox.dev'|'api.dev'|'sandbox'|'api'|'api.staging'|'sandbox.staging')} BondEnvType
     */

    /**
     * Create a BondExternalAccounts instance.
     * @constructor
     * @param {BondEnvType} bondEnv Set bond environment.
     */
    constructor({bondEnv = 'api'}: { bondEnv: string }) {

        this._appendPlaidLinkInitializeScript();

        // can be sandbox.dev, api.dev, sandbox(prod), api(prod), api.staging, sandbox.staging.
        this.bondEnv = bondEnv;
        // can be production, sandbox
        this.plaidEnv = bondEnv === 'api' || bondEnv === 'api.staging' || bondEnv === 'api.dev' ? 'production' : 'sandbox';
        this.bondHost = `https://${this.bondEnv}.bond.tech`;
    }

    /**
     * Connect external account.
     * @param {String} customer_id Set customer id.
     * @param {String} business_id Set business id.
     * @param {String} card_account_id Set card account id.
     * @param {String} identity Set identity token.
     * @param {String} authorization Set authorization token.
     */
    async linkAccount({ customerId: customer_id, businessId: business_id, accountId: card_account_id, identity, authorization }: LinkAccountParams) {
        const credentials: Credentials = {
            identity,
            authorization,
        }

        // `account_id` is used as `linked_account_id` for micro deposit flow
        const { account_id, link_token } = await this._createExternalAccount(customer_id ? { customer_id }: { business_id }, credentials);
        
        const response = await this._initializePlaidLink(link_token);

        if( (response as PlaidSuccessResponse).public_token ) {
            const successResponse = response as PlaidSuccessResponse;
            const public_token = successResponse.public_token;
            const metadata = successResponse.metadata;
            const external_account_id = metadata.account_id;

            const payload = {
                public_token,
                external_account_id,
                verification_status: metadata.account.verification_status || 'instantly_verified',
                bank_name: metadata.institution.name,
            }

            await this._exchangingTokens(account_id, payload, credentials);

            return await this._linkExternalAccountToCardAccount(card_account_id, account_id, credentials);

        } else {
            // TODO: await this._deleteExternalAccount(account_id, credentials);
            return (response as PlaidExitResponse);
        }

    }

    /**
     * Micro deposit.
     * @param {String} linked_account_id Set linked account id.
     * @param {String} identity Set identity token.
     * @param {String} authorization Set authorization token.
     */
    async microDeposit({
       linkedAccountId: linked_account_id,
       identity,
       authorization
    }: MicroDepositParams) {
        const credentials: Credentials = {
            identity,
            authorization,
        }

        const { link_token } = await this._updateExternalAccount(linked_account_id, {
            new_link_token: true,
        }, credentials);
        
        const response = await this._initializePlaidLink(link_token);
        if( (response as PlaidSuccessResponse).public_token ) {
            const successResponse = response as PlaidSuccessResponse;
            const metadata = successResponse.metadata;
            return await this._updateExternalAccount(linked_account_id, {
                new_link_token: false,
                verification_status: metadata.account.verification_status,
            }, credentials);
        } else {
            return (response as PlaidExitResponse);
        }

    }

    _appendPlaidLinkInitializeScript() {
        const script = document.createElement('script');
        script.src = "https://cdn.plaid.com/link/v2/stable/link-initialize.js"
        document.body.appendChild(script)
    }

    _initializePlaidLink(link_token?: string) {
        return new Promise<PlaidSuccessResponse|PlaidExitResponse>((resolve, reject) => {
            try {
                // @ts-ignore
                const handler = Plaid.create({
                    env: this.plaidEnv,
                    token: link_token,
                    onSuccess: (public_token, metadata) => {
                        resolve({ public_token, metadata } as PlaidSuccessResponse)
                    },
                    onLoad: () => {
                        handler.open();
                    },
                    onExit: (error, metadata) => {
                        resolve({ error, metadata } as PlaidExitResponse);
                    },
                    onEvent: (eventName, metadata) => {
                        // console.log(`event: ${eventName}`);
                    },
                    receivedRedirectUri: null,
                });
            } catch (error) {
                reject(error);
            }
        });
    };

    async  _exchangingTokens(account_id: string, payload: Payload, { identity, authorization }: Credentials) {
        const res = await fetch(`${this.bondHost}/api/v0/accounts/${account_id}`, {
            method: 'POST',
            headers: {
                'Identity': identity,
                'Authorization': authorization,
                'Content-type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        return data;
    };

    async _linkExternalAccountToCardAccount(card_account_id: string, external_account_id: string, { identity, authorization }: Credentials) {
        const res = await fetch(`${this.bondHost}/api/v0/accounts/${card_account_id}`, {
            method: 'PATCH',
            headers: {
                'Identity': identity,
                'Authorization': authorization,
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                add_external_accounts: [external_account_id]
            }),
        })

        return await res.json();
    }

    /**
     * Create an external account.
     * @param {String} id Set customer id.
     * @param {String} identity Set identity token.
     * @param {String} authorization Set authorization token.
     */
    async _createExternalAccount(id: { customer_id?: string; business_id?: string }, { identity, authorization }: Credentials) {
        const res = await fetch(`${this.bondHost}/api/v0/accounts`, {
            method: 'POST',
            headers: {
                'Identity': identity,
                'Authorization': authorization,
                'Content-type': 'application/json',
            },
            body: JSON.stringify({ type: 'external', link_type: 'plaid', ...id })
        });

        return await res.json();
    }

    async _updateExternalAccount(account_id: string, payload: UpdateExternalAccountPayload, { identity, authorization }: Credentials){
        const res = await fetch(`${this.bondHost}/api/v0/accounts/${account_id}`, {
            method: 'PATCH',
            headers: {
                'Identity': identity,
                'Authorization': authorization,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        return await res.json();
    }

    async _deleteExternalAccount(account_id: string, { identity, authorization }: Credentials){
        const res = await fetch(`${this.bondHost}/api/v0/accounts/${account_id}`, {
            method: 'DELETE',
            headers: {
                'Identity': identity,
                'Authorization': authorization,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'external',
                link_type: 'plaid'
            }),
        });

        return await res.json();
    }

    async deleteExternalAccount({
        accountId: account_id,
        identity,
        authorization
    }){
        const credentials: Credentials = {
            identity,
            authorization,
        }

        return await this._deleteExternalAccount(account_id, credentials);
    }
}

export default BondExternalAccounts;
