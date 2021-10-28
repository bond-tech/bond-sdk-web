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
  constructor({ bondEnv = 'api' }) {
    // can be sandbox.dev, api.dev, sandbox(prod), api(prod), api.staging, sandbox.staging.
    this.bondEnv = bondEnv;
    // can be production, sandbox
    this.plaidEnv = bondEnv === 'api' || bondEnv === 'api.staging' || bondEnv === 'api.dev' ? 'production' : 'sandbox';
    this.bondHost = `https://${this.bondEnv}.bond.tech`;
  }

  _initializePlaidLink(
      accountId: string,
      identity: string,
      authorization: string,
      data: any,
      { update = false, linkedAccountId }: { update: boolean, linkedAccountId?: string }
  ) {
    return new Promise((resolve, reject) => {
      try {
        // @ts-ignore
        const handler = Plaid.create({
          env: this.plaidEnv,
          token: data.link_token,
          onSuccess: (public_token, metadata) => {
            if (update) {
              resolve({
                status: 'micro_deposit',
                linked_account_id: linkedAccountId
              });
            } else {
              this._createAccessToken(accountId, identity, authorization, public_token, metadata, data)
                .then(resolve)
                .catch(reject);
            }
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

  _createAccessToken(accountId, identity, authorization, public_token, metadata, data) {
    return new Promise((resolve, reject) => {
      const verification_status = metadata.account.verification_status || 'instantly_verified';
      const external_account_id = metadata.account.id;
      const linked_account_id = data.linked_account_id;
      const bank_name = metadata.institution.name || 'None';

      // console.log('Successfully initialized plaid link object');
      // console.log('Exchanging', public_token, 'to get an access_token');
      // console.log('External account_id', external_account_id);
      // console.log('Linked account_id', linked_account_id);
      // console.log('Metadata', metadata);

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
   * Connect external account.
   * @param {String} accountId Set bond account id.
   * @param {String} identity Set identity token.
   * @param {String} authorization Set authorization token.
   */
  linkAccount({ accountId, identity, authorization }) {
    return fetch(`${this.bondHost}/api/v0/accounts/${accountId}/external_accounts/plaid`, {
        method: 'GET',
        headers: {
          'Identity': identity,
          'Authorization': authorization,
          'Content-type': 'application/json',
        },
      },
    )
      .then(response => response.json())
      .then(data => this._initializePlaidLink(accountId, identity, authorization, data, {
        update: false
      }));
  }

  _updateLinkToken({ accountId, linkedAccountId, identity, authorization }) {
    return new Promise((resolve, reject) => {
      try {
        return fetch(`${this.bondHost}/api/v0/accounts/${accountId}/external_accounts/plaid`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Identity': identity,
              'Authorization': authorization,
            },
            body: JSON.stringify({
              'linked_account_id': linkedAccountId,
            }),
          },
        )
          .then(response => response.json())
          .then(resolve);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Micro deposit.
   * @param {String} accountId Set bond account id.
   * @param {String} linkedAccountId Set linked account id.
   * @param {String} identity Set identity token.
   * @param {String} authorization Set authorization token.
   */
  microDeposit({ accountId, linkedAccountId, identity, authorization }) {
    return this._updateLinkToken({ accountId, linkedAccountId, identity, authorization })
      .then(data => this._initializePlaidLink(accountId, identity, authorization, data, { update: true, linkedAccountId }));
  }
}

export default BondExternalAccounts;