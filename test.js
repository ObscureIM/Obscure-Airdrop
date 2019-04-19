const Wallet = require('./wallet.js')
let wallet = new Wallet(1)

wallet.start().then((result) => {
  wallet.getSyncStatus().then((result) => {
    console.log(result)
  })
}).catch((error) => {
  console.log("failed to start wallet")
})
