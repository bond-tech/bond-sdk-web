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
    _initializePlaidLink(accountId: string, identity: string, authorization: string, data: any, { update, linkedAccountId }: {
        update: boolean;
        linkedAccountId?: string;
    }): Promise<unknown>;
    _createAccessToken(accountId: string, identity: string, authorization: string, public_token: string, metadata: any, data: any): Promise<unknown>;
    /**
     * Connect external account.
     * @param {String} accountId Set bond account id.
     * @param {String} identity Set identity token.
     * @param {String} authorization Set authorization token.
     */
    linkAccount({ accountId, identity, authorization }: {
        accountId: string;
        identity: string;
        authorization: string;
    }): Promise<unknown>;
    _updateLinkToken({ accountId, linkedAccountId, identity, authorization }: {
        linkedAccountId: string;
        accountId: string;
        identity: string;
        authorization: string;
    }): Promise<unknown>;
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
    }): Promise<unknown>;
}
export default BondExternalAccounts;
