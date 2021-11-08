import BondExternalAccounts from './bond-sdk-external-accounts';

const bondExternalAccounts = new BondExternalAccounts({ bondEnv: 'sandbox.staging' });

const btn = document.getElementById('btn');

btn.addEventListener('click', handleClick);

function handleClick() {
  const accountId = (<HTMLInputElement>document.getElementById('accountId')).value;
  const linkedAccountId = (<HTMLInputElement>document.getElementById('linkedAccountId')).value;
  const identity = (<HTMLInputElement>document.getElementById('identity')).value;
  const authorization = (<HTMLInputElement>document.getElementById('authorization')).value;

  bondExternalAccounts.microDeposit({
    accountId,
    linkedAccountId,
    identity,
    authorization,
  })
    .then(data => {
      console.log(data);
      sessionStorage.setItem('MICRO_DEPOSIT_SUCCESS', JSON.stringify(data))
    })
    .catch(error => {
      console.error(error);
      sessionStorage.setItem('MICRO_DEPOSIT_ERROR', JSON.stringify(error))
    });
}