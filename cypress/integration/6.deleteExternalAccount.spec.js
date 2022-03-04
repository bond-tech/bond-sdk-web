/// <reference types="cypress" />

let externalAccountId;

context('Actions', () => {
  beforeEach(() => {

    cy.intercept({
      method: 'POST',
      url: `${Cypress.env('serverEndpoint')}`,
    }).as('apiCreateExternalAccount')

    cy.intercept({
      method: 'POST',
      url: `https://sandbox.plaid.com/link/heartbeat`,
    }).as('apiPlaidHeartbeat')

    Cypress.config('defaultCommandTimeout', 30000);
    cy.intercept({
      method: 'POST',
      url: `${Cypress.env('serverEndpoint')}/*`,
    }).as('apiExchangingTokens');
    Cypress.config('defaultCommandTimeout', 5000);

    cy.intercept({
      method: 'PATCH',
      url: `${Cypress.env('serverEndpoint')}/${Cypress.env('accountId')}`,
    }).as('apiLinkExternalAccountToCardAccount')

    cy.intercept({
      method: 'DELETE',
      url: `${Cypress.env('serverEndpoint')}/*`,
    }).as('apiDeleteExternalAccountToCardAccount')
  });

  it('Link external account successfully', () => {
    cy.visitPage('link-account')

    // custom command in the /cypress/support/commands.js file
    cy.fillAndSubmit()

    cy.wait('@apiCreateExternalAccount').then(interception => {
      const { body } = interception.response;

      expect(body.account_id).not.null;
      expect(body.link_token).not.null;
      expect(body.link_type).eq('plaid');
      expect(body.type).eq('external');

      cy.wait('@apiPlaidHeartbeat').then(() => {

        cy.get('#plaid-link-iframe-1').then($iframe => {
          const $body = $iframe.contents().find('body');

          cy.wrap($body)
            .find('#aut-continue-button')
            .click();

          cy.wrap($body)
            .find('.PaneContent .InstitutionSearchResult').first().find('button').first().click();

          cy.wait(1000);

          cy.wrap($body)
            .find('#username').type('user_good');

          cy.wrap($body)
            .find('#password').type('pass_good');

          cy.wrap($body)
            .find('.ThreadsCredentialPane__form').first().find('button').first().click();

          cy.wait(4000);

          cy.wrap($body)
            .find('.PaneContent .ListItem input').first().click();

          cy.wait(1000);

          // submit checkbox
          cy.wrap($body)
            .find('#aut-continue-button')
            .click();

          // submit form
          cy.wrap($body)
            .find('#aut-continue-button')
            .click();

          cy.wait(2000);

          cy.wait('@apiExchangingTokens').then((interception) => {
            const body = interception.response.body;

            expect(body.status).to.eq('active');
            expect(body.verification_status).to.eq('instantly_verified');
            expect(body.access_token).not.null;
          })

          cy.wait(2000);

          cy.wait('@apiLinkExternalAccountToCardAccount').then((interception) => {
            const body = interception.response.body;

            expect(body.status).to.eq('Active');
            expect(body.account_id).not.null;
          })

          cy.wait(2000);

          cy.window().then(win=> {
            const payload = win.sessionStorage.getItem('CONNECT_ACCOUNT_SUCCESS');
            const parsed = JSON.parse(payload);
            const {external_accounts} = parsed

            externalAccountId = external_accounts[external_accounts.length - 1].account_id

            expect(parsed).to.have.property('account_id');
            expect(parsed).to.have.property('card_id');
            expect(parsed).to.have.property('status');
            expect(parsed).to.have.property('external_accounts');
          });
        })
      })
    })
  });

  it('Delete external account successfully', () => {
    cy.visitPage('delete-account')

    // custom command in the /cypress/support/commands.js file
    cy.fillAndSubmit(externalAccountId)

    cy.wait('@apiDeleteExternalAccountToCardAccount').then((interception) => {
      const body = interception.response.body;

      expect(body.account_id).eq(externalAccountId);
      expect(body.business_id).to.be.null;
      expect(body).to.have.property('customer_id');
      expect(body).to.have.property('date_created');
      expect(body).to.have.property('deleted_at');
      expect(body.link_type).eq('plaid');
      expect(body.status).eq('removed');
      expect(body.type).eq('external');
      expect(body.verification_status).eq('instantly_verified');
    })
  });

  it('Check deleted external account status', () => {
    cy.visitPage('link-account')

    // custom command in the /cypress/support/commands.js file
    cy.fillAndSubmit()

    cy.wait('@apiCreateExternalAccount').then(interception => {
      const { body } = interception.response;

      expect(body.account_id).not.null;
      expect(body.link_token).not.null;
      expect(body.link_type).eq('plaid');
      expect(body.type).eq('external');

      cy.wait('@apiPlaidHeartbeat').then(() => {

        cy.get('#plaid-link-iframe-1').then($iframe => {
          const $body = $iframe.contents().find('body');

          cy.wrap($body)
              .find('#aut-continue-button')
              .click();

          cy.wrap($body)
              .find('.PaneContent .InstitutionSearchResult').first().find('button').first().click();

          cy.wait(1000);

          cy.wrap($body)
              .find('#username').type('user_good');

          cy.wrap($body)
              .find('#password').type('pass_good');

          cy.wrap($body)
              .find('.ThreadsCredentialPane__form').first().find('button').first().click();

          cy.wait(4000);

          cy.wrap($body)
              .find('.PaneContent .ListItem input').first().click();

          cy.wait(1000);

          // submit checkbox
          cy.wrap($body)
              .find('#aut-continue-button')
              .click();

          // submit form
          cy.wrap($body)
              .find('#aut-continue-button')
              .click();

          cy.wait(2000);

          cy.wait('@apiExchangingTokens').then((interception) => {
            const body = interception.response.body;

            expect(body.status).to.eq('active');
            expect(body.verification_status).to.eq('instantly_verified');
            expect(body.access_token).not.null;
          })

          cy.wait(2000);

          cy.wait('@apiLinkExternalAccountToCardAccount').then((interception) => {
            const { status, account_id, external_accounts} = interception.response.body;

            const account = external_accounts.find(({ account_id }) => account_id === externalAccountId);

            expect(status).to.eq('Active');
            expect(account_id).not.null;
            expect(account.status).to.eq('removed');
          })
        })
      })
    })
  });
});

