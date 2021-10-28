import BondExternalAccounts from './bond-sdk-external-accounts';

const bondExternalAccounts = new BondExternalAccounts({ bondEnv: 'sandbox.staging', plaidEnv: 'sandbox' });

const btn = document.getElementById('btn');

btn.addEventListener('click', handleClick);

function handleClick() {
  const accountId = document.getElementById('accountId').value;
  const identity = document.getElementById('identity').value;
  const authorization = document.getElementById('authorization').value;

  bondExternalAccounts.linkAccount({
    accountId,
    identity,
    authorization,
  })
    .then(data => {
      console.log(data);
      sessionStorage.setItem('CONNECT_ACCOUNT_SUCCESS', JSON.stringify(data))
    })
    .catch(error => {
      console.error(error);
      sessionStorage.setItem('CONNECT_ACCOUNT_ERROR', JSON.stringify(error))
    });
}