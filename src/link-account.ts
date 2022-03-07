import { BondExternalAccounts, PlaidExitResponse, PlaidSuccessResponse } from './bond-sdk-web';

const bondExternalAccounts = new BondExternalAccounts({ bondEnv: 'sandbox.staging' });

const btn = document.getElementById('btn');

btn.addEventListener('click', handleClick);

function handleClick() {
  const customerId = (<HTMLInputElement>document.getElementById('customerId')).value;
  const accountId = (<HTMLInputElement>document.getElementById('accountId')).value;
  const identity = (<HTMLInputElement>document.getElementById('identity')).value;
  const authorization = (<HTMLInputElement>document.getElementById('authorization')).value;

  bondExternalAccounts.linkAccount({
    customerId,
    accountId,
    identity,
    authorization,
  })
    .then(data => {
      console.log(data);
      if( (response as PlaidSuccessResponse).public_token ) {
        sessionStorage.setItem('CONNECT_ACCOUNT_SUCCESS', JSON.stringify(data));
      } else {
        sessionStorage.setItem('CONNECT_ACCOUNT_EXIT', JSON.stringify(data));
      }
    })
    .catch(error => {
      console.error(error);
      sessionStorage.setItem('CONNECT_ACCOUNT_ERROR', JSON.stringify(error));
    });
}
