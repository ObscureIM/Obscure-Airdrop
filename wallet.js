const WalletPassword = require('./walletpassword.js')
let walletPassword = new WalletPassword();
const WB = require('obscure-wallet-backend');
//
var Wallet = function(setting) {
  //this.daemon = new WB.ConventionalDaemon('209.97.174.174', 11002);
  this.address = '209.97.174.174'
  this.port = 11002
  const daemon = new WB.ConventionalDaemon(this.address, this.port);

  // import from file =1 import from seed = 2
  if(setting == 1) {
    const [wallet,error] = WB.WalletBackend.openWalletFromFile(daemon,'airdrop.wallet',walletPassword.password)
    this.wallet = wallet
  }else if(setting ==2) {
    seed = 'skulls woozy ouch summon gifts huts waffle ourselves obtains hexagon ' +
            'tadpoles hacksaw dormant hence abort listen history atom cadets stylishly ' +
            'snout vegan girth guest history'
    const [wallet,error] = WB.WalletBackend.importWalletFromSeed(daemon,0,seed)
    this.wallet = wallet
  }

}

Wallet.prototype.start = async function() {
  wallet = this.wallet
  await wallet.start()
}

Wallet.prototype.getSyncStatus = async function() {
  wallet.reset(100000)
  return wallet.getSyncStatus()
}

Wallet.prototype.transfer = async function(address){
  wallet.rescan()
  return wallet.sendTransactionBasic(address,5000000000)
}

Wallet.prototype.getAddress = async function() {
  wallet = this.wallet
  return wallet.getPrimaryAddress();
}

Wallet.prototype.getBalance = async function() {
  wallet.rescan()
  return wallet.getBalance()
}

Wallet.prototype.getMnemonic = async function () {
  return wallet.getMnemonicSeed()
}



module.exports = Wallet;
