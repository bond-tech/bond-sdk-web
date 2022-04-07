# Bond Web SDK

This GA SDK includes classes that help [Brands Build on Bond](https://bond.tech). Note that when working with [Bond](https://bond.tech), you'll create API Keys (for `sandbox` or `live` applications) to enable access to the platform. Then you're ready to build. You can even [sign up for our sandbox](https://signup.bond.tech/?step=1) yourself. 


## Requirements

To use this SDK you can just import it using the steps under 'Installation'. But if you'd like to build the repo yourself, with or without sample files, you'll need:

- [Node.js **v6.3.0 or above**](https://nodejs.org/)

Node installation will include [NPM](https://www.npmjs.com/), which is
responsible for dependency management.

## Installation

### NPM

To install the module in your repo use your terminal to type:
`npm install bond-sdk-web`

Then import the key classes in your Javascript code:
`import { BondCards, BondExternalAccounts } from 'bond-sdk-web';`

### CDN

Or you can install the SDK from a CDN with `js`
```
import { BondCards, BondExternalAccounts } from 'cdn.bond.tech/sdk/web/v1/bond-sdk-web.js';
```
or in `html`
```
<script type="text/javascript" src="cdn.bond.tech/sdk/web/v1/bond-sdk-web.js"></script>
```
Bond archives all released versions of the SDK according to SemVer, and you can access any major-minor-patch version using URLs like the following: 
```
<script type="text/javascript" src="cdn.bond.tech/sdk/web/v/1/0/0/bond-sdk-web.js"></script>
```

## Using Temporary Tokens

Before executing any request, you need to authorize the calls to the Bond API

1. Make an authorized call _from your backend_ with the correct customer_id to
   receive temporary tokens of {Identity, Authorization}. Use these limited in scope-and-time values to make requests from your app, _not_ your own studio API keys. 

cURL

```
curl --request POST \
  --url https://api.bond.tech/api/v0/auth/key/temporary \
  --header 'Content-Type: application/json' \
  --header 'Identity: YOUR_IDENTITY' \
  --header 'Authorization: YOUR_AUTHORIZATION' \
  --data '{"customer_id": "YOUR_CUSTOMER_ID"}'
```

Python

```python
import requests

url = "https://api.bond.tech/api/v0/auth/key/temporary"

headers = { "Content-type": "application/json", "Identity": "YOUR_IDENTITY", "Authorization": "YOUR_AUTHORIZATION" }

payload = { 'customer_id': 'YOUR_CUSTOMER_ID' }

response = requests.post(url, headers=headers, json=payload)

print(response.text)
```

Ruby

```ruby
uri = URI.parse("https://api.bond.tech/api/v0/auth/key/temporary")
params = {'customer_id' => 'YOUR_CUSTOMER_ID'}
headers = {
    'Content-Type'=>'application/json',
    'Identity'=>'YOUR_IDENTITY',
    'Authorization'=>'YOUR_AUTHORIZATION'
}

http = Net::HTTP.new(uri.host, uri.port)
response = http.post(uri.path, params.to_json, headers)
output = response.body
puts output
```

Node

```js
const fetch = require("node-fetch");

let url = "https://api.bond.tech/api/v0/auth/key/temporary";
let options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Identity: "YOUR_IDENTITY",
    Authorization: "YOUR_AUTHORIZATION",
  },
  body: { customer_id: "YOUR_CUSTOMER_ID" },
};

fetch(url, options)
  .then((res) => res.json())
  .then((json) => console.log(json))
  .catch((err) => console.error("error:" + err));
```

Javascript

```js
// Client-side example for quick testing.
// You would call this from your backend in production

fetch("https://api.bond.tech/api/v0/auth/key/temporary", {
  method: "POST",
  headers: {
    "Content-type": "application/json",
    Identity: "YOUR_IDENTITY",
    Authorization: "YOUR_AUTHORIZATION",
  },
  body: {
    customer_id: "YOUR_CUSTOMER_ID",
  },
});
```

Java

```
OkHttpClient client = new OkHttpClient();

Request request = new Request.Builder()
  .url("https://api.bond.tech/api/v0/auth/key/temporary")
  .addHeader("Content-Type", "application/json")
  .addHeader("Identity", "YOUR_IDENTITY")
  .addHeader("Authorization", "YOUR_AUTHORIZATION")
  .post(RequestBody
                .create(MediaType
                    .parse("application/json"),
                        "{\"customer_id\": \"" + YOUR_CUSTOMER_ID + "\"}"
                ))
  .build();

Response response = client.newCall(request).execute();
```

C#

```
var client = new RestClient("https://api.bond.tech/api/v0/auth/key/temporary");
var request = new RestRequest(Method.POST);
request.AddHeader("Content-Type", "application/json");
request.AddHeader("Identity", "YOUR_IDENTITY");
request.AddHeader("Authorization", "YOUR_AUTHORIZATION");
request.AddParameter("application/json", {"customer_id": "YOUR_CUSTOMER_ID"}, ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
```

## Bond Card Management JavaScript SDK

Storing and processing card details including primary account number (PAN), CVV, expiration date, and personal identification number (PIN) involves complying with PCI DSS data security requirements. PCI compliance typically requires high overhead, so Bond created an SDK that vaults and tokenizes this card information. Using the below SDK, you can easily allow your customers to retrieve their card details, set PINs, and reset PINS without entering PCI scope, or worrying about seeing and storing your customers' sensitive card details.

-This overview outlines Requirements, Installation, and Usage.
-The `docs` folder here provides Bond Cards SDK Documentation you can run.
-Then check out the sample files to see sample implementation you can build and run.

### Usage

This SDK relies heavily on [Promises](https://developers.google.com/web/fundamentals/getting-started/primers/promises), making it easier to handle the asynchronous
requests made to the API. The SDK provides a `BondCards` object containing
several methods which map to the calls and parameters described in [BondCards's API documentation](https://docs.bond.tech/docs/retrieve-card-details-set-pins-and-reset-pins).

The following snippet is a generic example of how brands can use the SDK. If you need
details for a specific module, refer to the [sample files](https://github.com/bond-tech/bond-sdk-web).

#### Initialize BondCards

2. Call the constructor (pass `{live: true}` to access the Live environment)

```js
const bondCards = new BondCards({ live: false });
```

#### Making requests

3. You can now use the various methods from the SDK to reveal/manage PCI-sensitive
   data for a particular Bond Card ID. Following the Promises notation, you should
   use`.then()`/`.catch()` to handle the successful and failed requests,
   respectively.

Most of the calls take an object as the only parameter but please refer to the
API documentation to tune the query as intended.

```js
bondCards
  .show({
    cardId: [BOND CARD ID],
    identity: [TEMP IDENTITY TOKEN],
    authorization: [TEMP AUTH TOKEN],
    field: "number",
    htmlSelector: "#num",
    format: {
        replaceThis: "(\\d{4})(\\d{4})(\\d{4})(\\d{4})",
        withThis: "$1-$2-$3-$4",
      },
  })
  .then((data) => {
    // Handle data
  })
  .catch((error) => {
    // Handle an error
  });
```

4. You can easily control loading with the various methods from the SDK. You should
   use`.then()`/`.catch()` to handle the successful and failed requests,
   respectively.

```js
// Handle show loader
bondCards
    .showMultiple(configuration)
    .then((data) => {
        // Handle hide loader
    })
    .catch((error) => {
        // Handle hide loader
    });
```

### Bond External Accounts JavaScript SDK

[Money movement](https://docs.bond.tech/docs/moving-money-in-and-out-of-a-card) to cards may require [external account linking](https://docs.bond.tech/docs/linking-a-card-to-an-external-account) to transfer funds from a customer's bank account to a card, or vice versa. The `BondExternalAccounts` provides tooling to help link accounts to customers or business and their cards in your app. 

-This overview outlines Requirements, Installation, and Usage.
-The `docs` folder here provides Bond External Accounts SDK Documentation you can run.

#### Initialize BondExternalAccounts

Call the constructor (pass `{ live: true }` to access the Live environment)
```js
const bondExternalAccounts = new BondExternalAccounts({ live: false});
```

#### Linking account

Account linking starts a flow to link an account through online identity verfication and account selection. Start this flow in your app with:
```js
bondExternalAccounts
  .linkAccount({
    customer_id: CUSTOMER_ID, // or business_id: BUSINESS_ID
    identity: TEMP_IDENTITY_TOKEN,
    authorization: TEMP_AUTH_TOKEN,
  })
```

#### Microdeposits

Customers may need to undertake a [microdeposit](https://docs.bond.tech/docs/moving-money-in-and-out-of-a-card) to verify their account. Start this flow with: 
```js
bondExternalAccounts
  .microDeposit({
    accountId: ACCOUNT_ID,
    linkedAccountId: LINKED_ACCOUNT_ID,
    identity: TEMP_IDENTITY_TOKEN,
    authorization: TEMP_AUTH_TOKEN,
  })
```

#### Account Deletion

Delete linked external accounts with:
```js
bondExternalAccounts
  .microDeposit({
    accountId: LINKED_ACCOUNT_ID,
    identity: TEMP_IDENTITY_TOKEN,
    authorization: TEMP_AUTH_TOKEN,
  })
```

#### Available methods

See [API Documentation](https://github.com/bond-tech/bond-sdk-external-accounts/docs/gen/BondExternalAccounts.html)


## Working with the Repo

The following script aliases are available:

- `npm run doc`: Run JSDoc to create a 'docs' folder with automatically generated documentation for the source code.
- `npm run build`: Create a production build minified and transpiled js bundle without any sample code.
- `npm run start`: Lint SDK and Sample files, then Deploy a web server from the root folder at `localhost:8080` to run the html samples. Note the `webpack` config and sample scripts expect `IDENTITY` and `AUTHORIZATION` values in the environment. 

## Contact

Contact your Bond support representative or the developer experience team at [devex-eng@bond.tech](mailto:devex-eng@bond.tech) with questions, concerns, or feature requests regarding this SDK. 
