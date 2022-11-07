import { BondExternalAccounts } from './bond-sdk-web';

const bondExternalAccounts = new BondExternalAccounts({ live: false });

window.addEventListener('load', function() {
  const identity = '15febd7a-8193-45d5-80ce-5c85cb4baa8e';
  const authorization = '0XCyTRL07k0vTCeZZZwAEelr+5VNcGCU3mEF4jAN4tJpX9XCFV1yMdzKLDlDvWQ2';

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
