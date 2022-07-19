import { BondExternalAccounts } from './bond-sdk-web';

const bondExternalAccounts = new BondExternalAccounts({ live: false });

const btn = document.getElementById('btn');

btn.addEventListener('click', handleClick);

function handleClick() {
  const customerId = (<HTMLInputElement>document.getElementById('customerId')).value;
  const identity = process.env.IDENTITY;
  const authorization = process.env.AUTHORIZATION;
  // redirectUri is required if using OAuth and must be pre-configured with the Bond support team
  const redirectUri = 'http://localhost:8080/oauth-redirect.html';

  bondExternalAccounts.linkAccount({
    customerId,
    identity,
    redirectUri,
    authorization,
  })
    .then(response => {
      console.log(response);
      if (response.status == "linked") {
        console.log("success");
        sessionStorage.setItem('CONNECT_ACCOUNT_SUCCESS', JSON.stringify(response));
      } else if (response.status == "interrupted") {
        console.log("early exit");
        sessionStorage.setItem('CONNECT_ACCOUNT_EXIT', JSON.stringify(response));
      }
    })
    .catch(error => {
      console.error(error);
      sessionStorage.setItem('CONNECT_ACCOUNT_ERROR', JSON.stringify(error));
    });
}
