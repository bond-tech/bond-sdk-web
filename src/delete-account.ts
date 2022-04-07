import { BondExternalAccounts } from './bond-sdk-web';

const bondExternalAccounts = new BondExternalAccounts({ live: false });

const btn = document.getElementById('btn');

btn.addEventListener('click', handleClick);

function handleClick() {
  const accountId = (<HTMLInputElement>document.getElementById('accountId')).value;
  const identity = process.env.IDENTITY;
  const authorization = process.env.AUTHORIZATION;

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
