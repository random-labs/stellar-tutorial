const StellarSdk = require('stellar-sdk');

const pair = StellarSdk.Keypair.random();

console.log("pair.secret() = ", pair.secret());
console.log("pair.publicKey() = ", pair.publicKey());

var request = require('request');

function getTestAccount() {
  return new Promise((resolve, reject) => {
    request.get({
      url: 'https://horizon-testnet.stellar.org/friendbot',
      qs: {
        addr: pair.publicKey()
      },
      json: true
    }, function(error, response, body) {
      if (error || response.statusCode !== 200) {
        reject(error)
      } else {
        resolve(body)
      }

    });
  })
}

function getBalance() {
  var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

  return server.loadAccount(pair.publicKey()).then(function(account) {
    console.log('Balances for account: ' + pair.publicKey());
    account.balances.forEach(function(balance) {
      console.log('Type:', balance.asset_type, ', Balance:', balance.balance);
    });
  });
}

async function getAccount() {
  try {
    const body = await getTestAccount()
    console.log('SUCCESS! You have a new account :)\n', body);

    await getBalance()
  } catch (error) {
    console.error('ERROR!', error);
  }
}

getAccount()
