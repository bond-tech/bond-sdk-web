import { BondExternalAccounts } from './bond-sdk-web';

const bondExternalAccounts = new BondExternalAccounts({ live: false });

window.addEventListener('load', function() {
  const identity = '7408c066-d0d0-48ae-84ae-0abca1d803ab';
  const authorization = 'x8T3IWnEzGteMC/ylo7kztaWNG0dd1i5oGLzknr6i6RUsbyVksA5++dOp912ohQB';
  // const identity = process.env.IDENTITY;
  // const authorization = process.env.AUTHORIZATION;
  try {
    bondExternalAccounts.handleOAuthRedirect({ identity, authorization });
  } catch (e) {
    console.log(e);
  }
})
