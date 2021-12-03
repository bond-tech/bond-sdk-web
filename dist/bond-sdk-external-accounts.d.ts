interface Credentials {
    identity: string;
    authorization: string;
}
interface LinkAccountParams extends Credentials {
    customerId: string;
    accountId: string;
}
interface Payload {
    public_token: string;
    external_account_id: string;
    verification_status: string;
    bank_name: string;
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
/**
 * @classdesc Represents the Bond Account Connection SDK. It allows developers to
 * link external bank accounts with existing one.
 * @class
 */
declare class BondExternalAccounts {
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
    constructor({ bondEnv }: {
        bondEnv: string;
    });
    _appendPlaidLinkInitializeScript(): void;
    _initializePlaidLink(link_token: string): Promise<PlaidResponse>;
    _exchangingTokens(account_id: string, payload: Payload, { identity, authorization }: Credentials): Promise<ExchangingTokensResponse>;
    _linkExternalAccountToCardAccount(card_account_id: string, external_account_id: string, { identity, authorization }: Credentials): Promise<any>;
    _createAccessToken(accountId: string, identity: string, authorization: string, public_token: string, metadata: any, data: any): Promise<unknown>;
    /**
     * Create an external account.
     * @param {String} customer_id Set customer id.
     * @param {String} identity Set identity token.
     * @param {String} authorization Set authorization token.
     */
    _createExternalAccount(customer_id: string, { identity, authorization }: Credentials): Promise<any>;
    /**
     * Connect external account.
     * @param {String} customerId Set customer id.
     * @param {String} accountId Set card account id.
     * @param {String} identity Set identity token.
     * @param {String} authorization Set authorization token.
     */
    linkAccount({ customerId: customer_id, accountId: card_account_id, identity, authorization }: LinkAccountParams): Promise<any>;
    _updateLinkToken({ accountId, linkedAccountId, identity, authorization }: {
        linkedAccountId: string;
        accountId: string;
        identity: string;
        authorization: string;
    }): Promise<any>;
    /**
     * Micro deposit.
     * @param {String} accountId Set bond account id.
     * @param {String} linkedAccountId Set linked account id.
     * @param {String} identity Set identity token.
     * @param {String} authorization Set authorization token.
     */
    microDeposit({ accountId, linkedAccountId, identity, authorization }: {
        linkedAccountId: string;
        accountId: string;
        identity: string;
        authorization: string;
    }): Promise<any>;
}
export default BondExternalAccounts;
