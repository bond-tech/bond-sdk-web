import { BondExternalAccounts } from './bond-sdk-web';

const bondExternalAccounts = new BondExternalAccounts({ bondEnv: 'sandbox.staging' });

const btn = document.getElementById('btn');

btn.addEventListener('click', handleClick);

function handleClick() {
  const accountId = (<HTMLInputElement>document.getElementById('accountId')).value;
  const identity = (<HTMLInputElement>document.getElementById('identity')).value;
  const authorization = (<HTMLInputElement>document.getElementById('authorization')).value;

  bondExternalAccounts.deleteExternalAccount({
    accountId,
    identity,
    authorization,
  })
    .then(response => {
      console.log(response);
      if(response.status == "deleted") {
        sessionStorage.setItem('DELETE_ACCOUNT_SUCCESS', JSON.stringify(response))
      }
    })
    .catch(error => {
      console.error(error);
      sessionStorage.setItem('DELETE_ACCOUNT_ERROR', JSON.stringify(error))
    });
}
