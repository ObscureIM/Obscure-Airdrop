const WalletPassword = require('./walletpassword.js')
let walletPassword = new WalletPassword();
const WB = require('obscure-wallet-backend');
//
var Wallet = function() {
  //this.daemon = new WB.ConventionalDaemon('209.97.174.174', 11002);
  this.address = '209.97.174.174'
  this.port = 11002
  const daemon = new WB.ConventionalDaemon(this.address, this.port);
  const [wallet,error] = WB.WalletBackend.openWalletFromFile(daemon,'airdrop.wallet',walletPassword.password)
  this.wallet = wallet

}

Wallet.prototype.getSyncStatus = async function() {
  wallet = this.wallet
  await wallet.start()
  return wallet.getSyncStatus()
}

Wallet.prototype.transfer = async function(address){
  wallet = this.wallet
  await wallet.start()
  wallet.rescan()
  return wallet.sendTransactionBasic(address,5000000000)
}

Wallet.prototype.getAddress = async function() {
  wallet = this.wallet
  return wallet.getPrimaryAddress();
}

Wallet.prototype.getBalance = async function() {
  wallet = this.wallet
  await wallet.start()
  wallet.rescan()
  return wallet.getBalance()
}

Wallet.prototype.getMnemonic = async function () {
  wallet = this.wallet
  await wallet.start()
  return wallet.getMnemonicSeed()
}

module.exports = Wallet;
