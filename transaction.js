const YAML = require('yamljs');
const config = YAML.load('config.yml');

const StellarSdk = require('stellar-sdk');
StellarSdk.Network.useTestNetwork();

var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
var sourceKeys = StellarSdk.Keypair.fromSecret(config.accounts.main.secret);
var destinationId = config.accounts.sub1.public;

server.loadAccount(destinationId).catch(StellarSdk.NotFoundError, function(error) {
  throw new Error('The destination account does not exists');
}).then(function() {
  return server.loadAccount(sourceKeys.publicKey());
}).then(function(sourceAccount) {
  transaction = new StellarSdk.TransactionBuilder(sourceAccount)
    .addOperation(StellarSdk.Operation.payment({
      destination: destinationId,
      asset: StellarSdk.Asset.native(),
      amount: "10"
    }))
    .addMemo(StellarSdk.Memo.text('Test Tx'))
    .build();
  transaction.sign(sourceKeys);
  return server.submitTransaction(transaction);
}).then(function(result) {
  console.log('Success! Results:', result);
}).catch(function(error) {
  console.error('Something went wrong', error);
})
