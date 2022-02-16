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
declare type PlaidInsitution = {
    name: string;
    institution_id: string;
};
declare type PlaidError = {
    error_type: string;
    error_code: string;
    error_message: string;
    display_message: string;
};
declare type PlaidExitResponse = {
    error: PlaidError;
    metadata: {
        institution: PlaidInsitution;
        status: string;
        link_session_id: string;
        request_id: string;
    };
};
declare type PlaidAccount = {
    id: string;
    mask: string;
    name: string;
    subtype: string;
    type: string;
    verification_status: string;
};
declare type PlaidSuccessResponse = {
    public_token: string;
    metadata: {
        institution: PlaidInsitution;
        account: PlaidAccount;
        account_id: string;
        link_session_id: string;
        transfer_status?: string;
        public_token: string;
    };
};
interface UpdateExternalAccountPayload {
    new_link_token: boolean;
    verification_status?: string;
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
    _initializePlaidLink(link_token?: string): Promise<PlaidExitResponse | PlaidSuccessResponse>;
    _exchangingTokens(account_id: string, payload: Payload, { identity, authorization }: Credentials): Promise<any>;
    _linkExternalAccountToCardAccount(card_account_id: string, external_account_id: string, { identity, authorization }: Credentials): Promise<any>;
    /**
     * Create an external account.
     * @param {String} id Set customer id.
     * @param {String} identity Set identity token.
     * @param {String} authorization Set authorization token.
     */
    _createExternalAccount(id: {
        customer_id?: string;
        business_id?: string;
    }, { identity, authorization }: Credentials): Promise<any>;
    /**
     * Connect external account.
     * @param {String} customer_id Set customer id.
     * @param {String} business_id Set business id.
     * @param {String} card_account_id Set card account id.
     * @param {String} identity Set identity token.
     * @param {String} authorization Set authorization token.
     */
    linkAccount({ customerId: customer_id, businessId: business_id, accountId: card_account_id, identity, authorization }: LinkAccountParams): Promise<any>;
    _updateExternalAccount(account_id: string, payload: UpdateExternalAccountPayload, { identity, authorization }: Credentials): Promise<any>;
    /**
     * Micro deposit.
     * @param {String} linked_account_id Set linked account id.
     * @param {String} identity Set identity token.
     * @param {String} authorization Set authorization token.
     */
    microDeposit({ linkedAccountId: linked_account_id, identity, authorization, }: MicroDepositParams): Promise<any>;
    _deleteExternalAccount(account_id: string, { identity, authorization }: Credentials): Promise<any>;
    deleteExternalAccount({ accountId: account_id, identity, authorization }: {
        accountId: any;
        identity: any;
        authorization: any;
    }): Promise<any>;
}
export default BondExternalAccounts;
