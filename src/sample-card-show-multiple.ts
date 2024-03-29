import { BondCards } from './bond-sdk-web';

const bondCards = new BondCards({ live: true });

let hidden = true;
const data = {
  num: "tok_sandbox_21jmguFdztadFN6xfbcDtF",
  exp: "tok_sandbox_spuC49eoePEtkSFsGvrkdp",
  cvv: "tok_sandbox_eXEjyhDX64DJrSDs1Mc76m",
};
const css = {
  "font-family": "Arial, sans-serif",
  "font-size": "14px",
  color: "#606BF3FF",
};

const loadingHelper = (status) => {
  const num = document.getElementById('num-loading');
  const exp = document.getElementById('exp-loading');
  const cvv = document.getElementById('cvv-loading');

  [num, exp, cvv].forEach(el => {
    el.style.opacity = ['success', 'error'].includes(status) ? '0' : '1';
  })
  console.log(status);
}

const reveal = () => {
  // clear current field values
  document.getElementById("num").textContent = "";
  document.getElementById("exp").textContent = "";
  document.getElementById("cvv").textContent = "";
  document.getElementById("toggle").textContent = "Redact";

  // use temporary key token to reveal appropriate field values
  loadingHelper('pending');
  bondCards
    .showMultiple({
      cardId: (<HTMLInputElement>document.getElementById("card-id")).value,
      identity: (<HTMLInputElement>document.getElementById("identity")).value,
      authorization: (<HTMLInputElement>document.getElementById("authorization")).value,
      fields: {
        number: {
          htmlSelector: "#num",
          format: {
            replaceThis: "(\\d{4})(\\d{4})(\\d{4})(\\d{4})",
            withThis: "$1-$2-$3-$4",
          },
          css,
        },
        expiry: {
          htmlSelector: "#exp",
          format: {
            replaceThis: "(\\d{2})(\\d{4})",
            withThis: "$1/$2",
          },
          css,
        },
        cvv: {
          htmlSelector: "#cvv",
          css,
        }
      },
    })
    .then(() => {
      loadingHelper('success');
    })
    .catch((error) => {
      loadingHelper('error');
      console.error(error);
    });
};

const redact = () => {
  document.getElementById("num").textContent = data.num;
  document.getElementById("exp").textContent = data.exp;
  document.getElementById("cvv").textContent = data.cvv;
  document.getElementById("toggle").textContent = "Reveal";
};

(<any>window).toggle = () => {
  if (hidden) {
    reveal();
  } else {
    redact();
  }
  hidden = !hidden;
};

redact();
