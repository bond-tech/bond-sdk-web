import { BondExternalAccounts } from './bond-sdk-web';

const bondExternalAccounts = new BondExternalAccounts({ live: false });

window.addEventListener('load', function() {
  const identity = process.env.IDENTITY;
  const authorization = process.env.AUTHORIZATION;

  bondExternalAccounts.handleOAuthRedirect({
    identity,
    authorization,
  })
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.error(error);
    });
})
