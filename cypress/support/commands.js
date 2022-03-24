// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

const CLIENT_ENDPOINT = Cypress.env('CLIENT_ENDPOINT');
const STUDIO_HOST = Cypress.env('STUDIO_HOST');
const IDENTITY = Cypress.env('IDENTITY');
const AUTHORIZATION = Cypress.env('AUTHORIZATION');

const DEBIT_CUSTOMER_ID = Cypress.env('DEBIT_CUSTOMER_ID');
const CREDIT_CUSTOMER_ID = Cypress.env('CREDIT_CUSTOMER_ID');

// ***********************************************
// visit webpage
// ***********************************************

Cypress.Commands.add('visitPage', (name = 'index') => {
  cy.visit(`${CLIENT_ENDPOINT}/${name}.html`);

  cy.window().then((win) => {
    win.sessionStorage.clear();
  });
});

// ***********************************************
// Retrieve temporary token from Studio Auth Service
// ***********************************************

Cypress.Commands.add('getTempTokenDebit', () => {

  cy.request({
    method: 'POST',
    url: `https://${STUDIO_HOST}/api/v0/auth/key/temporary`,
    headers: {
      'Content-Type': 'application/json',
      Identity: IDENTITY,
      Authorization: AUTHORIZATION,
    },
    body: {
      customer_id: DEBIT_CUSTOMER_ID,
    },
    timeout: 120000,
    failOnStatusCode: false,
  }).as('debit_temp_token')
    .then((resp) => {
      if (
        !(
          resp.isOkStatusCode ||
          (ignoreIfExists && resp.body === IGNORED_ERROR_MSG)
        )
      ) {
        const EXCEPTION_MSG = 'Exception when requesting temporary token';
        console.error(EXCEPTION_MSG + ':\n' + JSON.stringify(resp));
        throw new Error(
          EXCEPTION_MSG +
            '.\nCode: ' +
            JSON.stringify(resp.status) +
            '\nMessage:' +
            JSON.stringify(resp.body)
        );
      }
    });

  cy.get('@debit_temp_token').should((response) => {
    expect(response).to.have.property('body');
    expect(response.body).to.have.property('Identity');
    expect(response.body).to.have.property('Authorization');
    window.Identity = response.body['Identity'];
    window.Authorization = response.body['Authorization'];
  });

});

Cypress.Commands.add('getTempTokenCredit', () => {
  
  cy.request({
    method: 'POST',
    url: `https://${STUDIO_HOST}/api/v0/auth/key/temporary`,
    headers: {
      'Content-Type': 'application/json',
      Identity: IDENTITY,
      Authorization: AUTHORIZATION,
    },
    body: {
      customer_id: CREDIT_CUSTOMER_ID,
    },
    timeout: 120000,
    failOnStatusCode: false,
  }).as('credit_temp_token')
    .then((resp) => {
      if (
        !(
          resp.isOkStatusCode ||
          (ignoreIfExists && resp.body === IGNORED_ERROR_MSG)
        )
      ) {
        const EXCEPTION_MSG = 'Exception when requesting temporary token';
        console.error(EXCEPTION_MSG + ':\n' + JSON.stringify(resp));
        throw new Error(
          EXCEPTION_MSG +
            '.\nCode: ' +
            JSON.stringify(resp.status) +
            '\nMessage:' +
            JSON.stringify(resp.body)
        );
      }
    });

  cy.get('@credit_temp_token').should((response) => {
    expect(response).to.have.property('body');
    expect(response.body).to.have.property('Identity');
    expect(response.body).to.have.property('Authorization');
    window.Identity = response.body['Identity'];
    window.Authorization = response.body['Authorization'];
  });

});

// ***********************************************
// Form in Brand Backend Section filled out
// - three input fields:
//   Card id, Identity, and Authorization
// ***********************************************

Cypress.Commands.add('fillBrandBackendSectionOut', (card_id) => {
  cy.get('#card-id').type(card_id).should('have.value', card_id);
  cy.get('#identity')
    .type(`${window.Identity}`)
    .should('have.value', `${window.Identity}`);
  cy.get('#authorization')
    .type(`${window.Authorization}`)
    .should('have.value', `${window.Authorization}`);
});

// ***********************************************
// Verify the values in Brand App Section of
// Sample Card Show and Sample Card Show Multiple
// - three values in response to be verified:
//   Card number, Expiration Date, and CVV
// ***********************************************

Cypress.Commands.add('verifyReavealedInfo', (card_num, card_exp, card_cvv) => {
  cy.get('[name=number]').then(($iframe) => {
    const $body = $iframe.contents().find('body');
    cy.wrap($body).find('#result').invoke('text').should('include', card_num);
  });

  cy.get('[name=expiry]').then(($iframe) => {
    const $body = $iframe.contents().find('body');
    cy.wrap($body).find('#result').invoke('text').should('include', card_exp);
  });

  cy.get('[name=cvv]').then(($iframe) => {
    const $body = $iframe.contents().find('body');
    cy.wrap($body).find('#result').invoke('text').should('include', card_cvv);
  });
});

// -- This is a parent command --
Cypress.Commands.add('fillAndSubmitLink', () => {
    cy.get('#customerId').clear().type(DEBIT_CUSTOMER_ID);
    cy.get('#identity').clear().type(IDENTITY);
    cy.get('#authorization').clear().type(AUTHORIZATION);
    cy.get('#btn').click();
})

Cypress.Commands.add('fillAndSubmitDelete', (accountId) => {
    cy.get('#accountId').clear().type(accountId || Cypress.env('accountId'));
    cy.get('#identity').clear().type(IDENTITY);
    cy.get('#authorization').clear().type(AUTHORIZATION);
    if(Cypress.env('LINKED_ACCOUNT_ID')) {
      cy.get('#linkedAccountId').clear().type(Cypress.env('LINKED_ACCOUNT_ID'));
    }
    cy.get('#btn').click();
})

