/// <reference types="cypress" />

context('Actions', () => {

  beforeEach(() => {

    cy.visitPage('link-account')

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
    }).as('apiExchangingTokens')

  });

  it('Link external account successfully', () => {
    
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
          });

          cy.wait(10000);

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
          });
          
        })
      })
    })
  });

});

