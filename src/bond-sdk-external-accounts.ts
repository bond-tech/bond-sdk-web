interface Credentials {
    identity: string;
    authorization: string;
}

interface LinkAccountParams extends Credentials {
    customerId: string;
    accountId: string;
}

interface MicroDepositParams extends Credentials {
    customerId: string;
    accountId: string;
    // linkedAccountId: string;
}

interface Payload {
    public_token: string;
    external_account_id: string;
    verification_status: string;
    bank_name: string;
}

interface CreateExternalAccountResponse {
    account_id: string;
    customer_id: string;
    date_created: string;
    date_updated: string;
    expiration: string;
    link_token: string;
    link_type: string;
    status: string;
    type: string;
    verification_status: string;
}

interface PlaidResponse {
    public_token: string;
    metadata: {
        account: {
            id: string;
            mask: string;
            name: string;
            subtype: string;
            type: string;
            verification_status: string;
        };
        account_id: string;
        institution: {
            name: string;
            institution_id: string;
        };
        link_session_id: string;
        public_token: string;
    };
}

interface ExchangingTokensResponse {
    access_token: string;
    status: string;
    verification_status: string;
}

interface LinkExternalAccountToCardAccountResponse {
    account_id: string;
    date_created: string;
    date_updated: string;
    link_type: string;
    status: string;
    type: string;
    verification_status: string;
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

    _appendPlaidLinkInitializeScript() {
        const script = document.createElement('script');
        script.src = "https://cdn.plaid.com/link/v2/stable/link-initialize.js"
        document.body.appendChild(script)
    }

    _initializePlaidLink(link_token: string) {
        return new Promise<PlaidResponse>((resolve, reject) => {
            try {
                // @ts-ignore
                const handler = Plaid.create({
                    env: this.plaidEnv,
                    token: link_token,
                    onSuccess: (public_token, metadata) => {
                        console.log('_initializePlaidLink')
                        console.log('public_token', public_token)
                        console.log('metadata', metadata)
                        resolve({ public_token, metadata })
                    },
                    onLoad: () => {
                        // console.log('load');
                        handler.open();
                    },
                    onExit: (err, metadata) => {
                        // console.log('exit');
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

        const data: ExchangingTokensResponse = await res.json();

       console.log('_exchangingTokens', data)

        // Current:
        // access_token: "access-sandbox-f0f9a83e-5568-441d-be1b-d12bdc207919"
        // status: "active"
        // verification_status: "instantly_verified"

        // Expected:
        // "account_id": "1a130d45-3dc3-4c58-b0d8-9784aae0d009",
        // "type": "external",
        // "link_type": "plaid",
        // "status": "active",
        // "verification_status": "instantly_verified",
        // "access_token": "access-sandbox-035d67aa-5d6b-4014-98af-e09b7335ea31",
        // "account_type": "checking",
        // "account_category": "depository"

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

        const data = await res.json();

        console.log('_linkExternalAccountToCardAccount')
        console.log(data)

        return data;
    }

    _createAccessToken(accountId: string, identity: string, authorization: string, public_token: string, metadata, data) {
        return new Promise((resolve, reject) => {
            const verification_status = metadata.account.verification_status || 'instantly_verified';
            const external_account_id = metadata.account.id;
            const linked_account_id = data.linked_account_id;
            const bank_name = metadata.institution.name || 'None';

            fetch(`${this.bondHost}/api/v0/accounts/${accountId}/external_accounts/plaid`, {
                    method: 'POST',
                    headers: {
                        'Identity': identity,
                        'Authorization': authorization,
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        public_token,
                        linked_account_id,
                        external_account_id,
                        status: verification_status,
                        bank_name,
                    }),
                },
            )
                .then(response => response.json())
                .then(data => {
                    if (data.Status) {
                        reject(data);
                    } else {
                        resolve({
                            status: 'successfully_linked',
                            linked_account_id,
                        });
                    }
                })
                .catch(reject);
        });
    };

    /**
     * Create an external account.
     * @param {String} customer_id Set customer id.
     * @param {String} identity Set identity token.
     * @param {String} authorization Set authorization token.
     */
    async _createExternalAccount(customer_id: string, { identity, authorization }: Credentials) {

        const res = await fetch(`${this.bondHost}/api/v0/accounts`, {
            method: 'POST',
            headers: {
                'Identity': identity,
                'Authorization': authorization,
                'Content-type': 'application/json',
            },
            body: JSON.stringify({ type: 'external', link_type: 'plaid', customer_id })
        });

        const data = await res.json();

        // Current:
        // account_id: "dfa4d76a-2f63-4a4a-affd-4b75546522f7"
        // type: "external"
        // link_type: "plaid"
        // status: null                                         // empty
        // verification_status: null                            // empty
        // link_token: "link-sandbox-2f99865b-26e5-4795-a664-b996f911e3e8"
        // expiration: "2021-12-02T20:55:33Z"
        // customer_id: "dac6afec-a868-42b6-88ad-b7a119a41f01"  // additional
        // date_created: "2021-12-02T16:55:33.418560+00:00"
        // date_updated: "2021-12-02T16:55:33.418570+00:00"

        // Expected:
        // "account_id": "2742ff6a-7455-4066-8b45-ae12d3acca34",
        // "type": "external",
        // "link_type": "plaid",
        // "status": "active",
        // "verification_status": "instantly_verified",
        // "link_token": "link-sandbox-09fa148c-497a-4a22-87c9-581a7dea46de",
        // "expiration": "2021-01-27t23:29:06z",
        // "date_created": "2020-05-29t14:59:38.386850",
        // "date_updated": "2020-05-29t14:59:38.386930",

        console.log('_createExternalAccount', data);

        return data;
    }

    /**
     * Connect external account.
     * @param {String} customer_id Set customer id.
     * @param {String} card_account_id Set card account id.
     * @param {String} identity Set identity token.
     * @param {String} authorization Set authorization token.
     */
    async linkAccount({ customerId: customer_id, accountId: card_account_id, identity, authorization }: LinkAccountParams) {
        const credentials: Credentials = {
            identity,
            authorization,
        }

        const { account_id, link_token } = await this._createExternalAccount(customer_id, credentials);

        const { public_token, metadata } = await this._initializePlaidLink(link_token);

        const external_account_id = metadata.account_id;

        const payload = {
            public_token,
            external_account_id,
            verification_status: metadata.account.verification_status || 'instantly_verified',
            bank_name: metadata.institution.name,
        }

        await this._exchangingTokens(account_id, payload, credentials);

        return await this._linkExternalAccountToCardAccount(card_account_id, account_id, credentials);
    }

    async _updateLinkToken(account_id: string, linked_account_id: string, { identity, authorization }: Credentials) {
        const res = await fetch(`${this.bondHost}/api/v0/accounts/${account_id}/external_accounts/plaid`, {
            method: 'PATCH',
            headers: {
                'Identity': identity,
                'Authorization': authorization,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                linked_account_id,
            }),
        });

        const data = await res.json();

        console.log('_updateLinkToken')
        console.log(data)

        return data;
    }

    async _updateExternalAccount(account_id: string, { identity, authorization }: Credentials){
        const res = await fetch(`${this.bondHost}/api/v0/accounts/${account_id}`, {
            method: 'PATCH',
            headers: {
                'Identity': identity,
                'Authorization': authorization,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                new_link_token: true,
            }),
        });

        const data = await res.json();

        console.log('_updateExternalAccount')
        console.log(data)

        return data;
    }

    /**
     * Micro deposit.
     * @param {String} customer_id Set bond customer id.
     * @param {String} card_account_id Set bond card account id.
     * @param {String} linked_account_id Set linked account id.
     * @param {String} identity Set identity token.
     * @param {String} authorization Set authorization token.
     */
    async microDeposit({
       customerId: customer_id,
       accountId: card_account_id,
       // linkedAccountId: linked_account_id,
       identity,
       authorization
    }: MicroDepositParams) {
        const credentials: Credentials = {
            identity,
            authorization,
        }

        // const { link_token } = await this._updateLinkToken(card_account_id, linked_account_id, credentials) // OLD

        const { account_id, link_token } = await this._createExternalAccount(customer_id, credentials);

        const { public_token, metadata } = await this._initializePlaidLink(link_token);

        return await this._updateExternalAccount(card_account_id, credentials)
    }
}

export default BondExternalAccounts;
