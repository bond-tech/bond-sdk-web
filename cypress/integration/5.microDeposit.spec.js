/// <reference types="cypress" />

context('Actions', () => {
  // Plaid team adds recaptcha, so we can not test this logic for now.
  // it.skip('Do micro deposit successfully', () => {
  //   getLinkedAccountId(cy, (linkedAccountId) => {
  //     // Before each
  //
  //     Cypress.env('linkedAccountId', linkedAccountId);
  //
  //     cy.visitPage('micro-deposit');
  //
  //     // Body
  //
  //     // custom command in the /cypress/support/commands.js file
  //     cy.fillAndSubmit();
  //
  //     cy.wait(4000);
  //
  //     cy.get('#plaid-link-iframe-1').then($iframe => {
  //       const $body = $iframe.contents().find('body');
  //
  //       cy.wrap($body)
  //         .find('#firstAmount')
  //         .type('01');
  //
  //       cy.wrap($body)
  //         .find('.PaneContent .Pane__button').first().find('button').first().click();
  //
  //       cy.wait(1000);
  //
  //       cy.wrap($body)
  //         .find('#secondAmount')
  //         .type('02');
  //
  //       cy.wrap($body)
  //         .find('.PaneContent .Pane__button').first().find('button').first().click();
  //
  //       cy.wait(1000);
  //
  //       cy.wrap($body)
  //         .find('.PaneActions').first().find('button').first().click();
  //
  //       cy.wait(2000);
  //
  //       cy.window().then(win => {
  //         const payload = win.sessionStorage.getItem('MICRO_DEPOSIT_SUCCESS');
  //
  //         cy.log(payload);
  //
  //         const parsed = JSON.parse(payload)
  //
  //         expect(parsed).to.have.property('linked_account_id');
  //         expect(parsed.linked_account_id).to.eq(linkedAccountId);
  //       });
  //     });
  //   });
  // });
});

function getLinkedAccountId(cy, cb) {
  cy.intercept({
    method: 'GET',
    url: `${Cypress.env('serverEndpoint')}/${Cypress.env('accountId')}/external_accounts/plaid`,
  }).as('apiPlaidGet');

  cy.intercept({
    method: 'POST',
    url: `${Cypress.env('serverEndpoint')}/${Cypress.env('accountId')}/external_accounts/plaid`,
  }).as('apiPlaid');

  Cypress.env('linkedAccountId', '')

  cy.visitPage('link-account');

  cy.fillAndSubmit();

  cy.wait(4000);

  cy.wait('@apiPlaidGet').then((interception) => {
    const body = interception.response.body;

    cy.log(JSON.stringify(body));

    Cypress.env('linkedAccountId', body.linked_account_id);

    cy.get('#plaid-link-iframe-1').then($iframe => {
      const $body = $iframe.contents().find('body');

      cy.log($body);

      cy.wrap($body)
        .find('#aut-continue-button')
        .click();

      cy.wrap($body)
        .find('.InstitutionSearchInput__input')
        .first()
        .type('undefined');

      cy.wait(2000);

      cy.wrap($body)
        .find('.InstitutionSearchMessage__message-button')
        .first()
        .click();

      cy.wait(1000);

      cy.wrap($body)
        .find('.MicrodepositsIntroductoryPane .PaneActions .Button')
        .first()
        .click();

      cy.wait(1000);

      cy.wrap($body)
        .find('#name.Input__field')
        .type('John Snow');

      cy.wrap($body)
        .find('.MicrodepositsNamePane .PaneActions .Button')
        .first()
        .click();

      cy.wait(1000);

      cy.wrap($body)
        .find('.MicrodepositsAccountTypePane .MicrodepositsAccountTypePane__button')
        .first()
        .click();

      cy.wrap($body)
        .find('.MicrodepositsAccountTypePane .PaneActions .Button')
        .first()
        .click();

      cy.wait(1000);

      cy.wrap($body)
        .find('.MicrodepositsClassTypePane .MicrodepositsClassTypePane__button')
        .first()
        .click();

      cy.wrap($body)
        .find('.MicrodepositsClassTypePane .PaneActions .Button')
        .first()
        .click();

      cy.wait(1000);

      cy.wrap($body)
        .find('.NumbersPane #routing')
        .type('110000000');

      cy.wrap($body)
        .find('.NumbersPane .PaneContent .Button')
        .first()
        .click();

      cy.wait(1000);

      cy.wrap($body)
        .find('.NumbersPane #account')
        .type('1111222233330000');

      cy.wrap($body)
        .find('.NumbersPane .PaneContent .Button')
        .first()
        .click();

      cy.wait(1000);

      cy.wrap($body)
        .find('.NumbersPane #account')
        .type('1111222233330000');

      cy.wrap($body)
        .find('.NumbersPane .PaneContent .Button')
        .first()
        .click();

      cy.wait(1000);

      cy.wrap($body)
        .find('.Pane.Pane--is-plaid-branded .PaneActions .Button')
        .first()
        .click();

      cy.wait(5000);

      cy.wrap($body)
        .find('.Pane.RecaptchaPane iframe[src*=recaptcha]')
        .its('0.contentDocument.body')
        .should('not.be.undefined')
        .and('not.be.empty')
        .then(cy.wrap)
        .find('.recaptcha-checkbox-border')
        .click();

      cy.wait(1000);

      cy.wrap($body)
        .find('.Pane.Pane--is-plaid-branded .PaneActions .Button')
        .first()
        .click();

      cy.wait('@apiPlaid').then(() => {
        cb(body.linked_account_id)
      })
    });
  });
}

