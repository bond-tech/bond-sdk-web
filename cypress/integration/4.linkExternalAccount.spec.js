/// <reference types="cypress" />

context('Actions', () => {
  beforeEach(() => {
    cy.visitPage('link-account')

    console.log(Cypress.env('serverEndpoint'));

    cy.intercept({
      method: 'POST',
      url: `${Cypress.env('serverEndpoint')}/${Cypress.env('accountId')}/external_accounts/plaid`,
    }).as('apiPlaid')

    cy.intercept({
      method: 'POST',
      url: `https://sandbox.plaid.com/link/heartbeat`,
    }).as('apiPlaidHeartbeat')

    Cypress.env('linkedAccountId', '')
  });

  it('Link external account successfully', () => {

    // custom command in the /cypress/support/commands.js file
    cy.fillAndSubmit()

    cy.wait('@apiPlaidHeartbeat').then(() => {

      cy.get('#plaid-link-iframe-1').then($iframe => {
        const $body = $iframe.contents().find('body');

        cy.log($body)

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

        cy.wrap($body)
          .find('.PaneContent .ListItem input').first().click();

        cy.wait(1000);

        cy.wrap($body)
          .find('#aut-continue-button')
          .click();

        cy.wait(1000);

        cy.wrap($body)
            .find('#aut-continue-button')
            .click();

        cy.wait('@apiPlaid').then((interception) => {
          const body = interception.response.body;
          cy.log(JSON.stringify(body))

          expect(body.status).to.eq('active');
          expect(body.verification_status).to.eq('instantly_verified');
        })

        cy.window().then(win=> {
          const payload = win.sessionStorage.getItem('CONNECT_ACCOUNT_SUCCESS');

          cy.log(payload)

          const parsed = JSON.parse(payload);

          cy.log(parsed)

          expect(parsed).to.have.property('linked_account_id');
        });
      })
    })
  });
});

