/// <reference types="cypress" />

let externalAccountId;

context('Actions', () => {
  
  beforeEach(() => {

    cy.intercept({
      method: 'POST',
      url: `${Cypress.env('SERVER_ENDPOINT')}`,
    }).as('apiCreateExternalAccount')

    cy.intercept({
      method: 'POST',
      url: `https://sandbox.plaid.com/link/heartbeat`,
    }).as('apiPlaidHeartbeat')

    cy.intercept({
      method: 'POST',
      url: `${Cypress.env('SERVER_ENDPOINT')}/*`,
    }).as('apiExchangingTokens');

    cy.intercept({
      method: 'DELETE',
      url: `${Cypress.env('SERVER_ENDPOINT')}/*`,
    }).as('apiDeleteExternalAccount')

  });

  it('Link external account successfully', () => {
    cy.visitPage('link-account')

    // custom command in the /cypress/support/commands.js file
    cy.fillAndSubmitLink()

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

          cy.wait(3000);

          cy.window().then(win=> {
            const payload = win.sessionStorage.getItem('CONNECT_ACCOUNT_SUCCESS');
            expect(payload).not.null;
            const parsed = JSON.parse(payload);

            expect(parsed).to.have.property('status');
            expect(parsed.status).to.eq('linked');
            expect(parsed).to.have.property('linkedAccount');
            expect(parsed.linkedAccount).not.null;
            expect(parsed).to.have.property('linkedAccountId');
            expect(parsed.linkedAccountId).not.null;

            externalAccountId = parsed.linkedAccountId;

          });

        })
      })
    })

  });

  it('Delete external account successfully', () => {
    cy.visitPage('delete-account')

    // custom command in the /cypress/support/commands.js file
    cy.fillAndSubmitDelete(externalAccountId)

    cy.wait('@apiDeleteExternalAccount').then((interception) => {
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

  /*

  So I am not sure we can use this flow now; if we don't associate with 
  a card account, then we just create another linked account here. 

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
          });

        })
      })
    })
  });
  */

});
