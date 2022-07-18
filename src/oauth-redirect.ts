import { BondExternalAccounts } from './bond-sdk-web';

const bondExternalAccounts = new BondExternalAccounts({ live: false });

window.addEventListener('load', function() {
  const identity = process.env.IDENTITY;
  const authorization = process.env.AUTHORIZATION;

  try {
    bondExternalAccounts.handleOAuthRedirect({ identity, authorization });
  } catch (e) {
    console.log(e);
  }
})
