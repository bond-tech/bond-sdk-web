import { BondExternalAccounts } from './bond-sdk-web';

// const bondExternalAccounts = new BondExternalAccounts({ bondEnv: 'sandbox.staging' });
const bondExternalAccounts = new BondExternalAccounts({ live: false });

const btn = document.getElementById('btn');

btn.addEventListener('click', handleClick);

function handleClick() {
  // const customerId = (<HTMLInputElement>document.getElementById('customerId')).value;
  // const accountId = (<HTMLInputElement>document.getElementById('accountId')).value;
  const linkedAccountId = (<HTMLInputElement>document.getElementById('linkedAccountId')).value;
  const identity = (<HTMLInputElement>document.getElementById('identity')).value;
  const authorization = (<HTMLInputElement>document.getElementById('authorization')).value;

  bondExternalAccounts.microDeposit({
    // customerId,
    // accountId,
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
