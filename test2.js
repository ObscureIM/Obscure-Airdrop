const WB = require('obscure-wallet-backend');

(async () => {
    const daemon = new WB.ConventionalDaemon('209.97.174.174', 11002);
    /* OR
    const daemon = new WB.BlockchainCacheApi('blockapi.turtlepay.io, true);
    */

    const wallet = WB.WalletBackend.createWallet(daemon);

    console.log('Created wallet');
    await wallet.start();
    wallet.rescan()
    console.log(wallet.getBalance())
    console.log(wallet.getSyncStatus())

    /* After some time...
    wallet.stop();
    */

})().catch(err => {
    console.log('Caught promise rejection: ' + err);
});
