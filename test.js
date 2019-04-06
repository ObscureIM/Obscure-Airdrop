const Wallet = require('./wallet.js')
let wallet = new Wallet()
wallet.getSyncStatus().then((result) => {
  console.log(result)
}).catch((error) => {
  console.log(error)
})
wallet.transfer("XSC1PuhySb9dUvFbJRFNQUPLqYBr7LrVgEoW4psf5ngp1HR2eEQtpf2Qw3pd2DaVV5e3yYU5StMyvDsR1JJM2pdT1QLAJDkxtB").then((result) => {
  if((result[0]) == undefined) {
    console.log("Error: " + result[1].errorCode)
  }else {
    console.log("Transaciton hash: " + result[0])
  }
}).catch((error) => {
  message.channel.send(error)
})

wallet.getBalance().then((result) => {
  console.log(result)
}).catch((error) => {
  console.log(error)
})
