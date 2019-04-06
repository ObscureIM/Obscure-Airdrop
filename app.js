const ObscureTipPassword = require('./password.js')
let obscureTip = new ObscureTipPassword()

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});
//create a schema

var schema = new mongoose.Schema({
  id: String,
  address: String,
  timeClaim: Number,
  claimStatus: Number
})

//lets compile the model, each user will get 1 model with 1 address
var AddressModel = mongoose.model('addressModel',schema)
const Discord = require('Discord.js')
const client = new Discord.Client()
const Wallet = require('./wallet.js')
const wallet = new Wallet()

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  // If the message is "ping"
  if(message.content == ("!time")){
    AddressModel.findOne({'id':message.author.id},function(err,addressModel) {
      if(addressModel == null) {
        message.channel.send("You have yet to register for an airdrop, type !airdrop")
      }else {
        timeStart = addressModel.timeClaim
        currentTimeLeft = secondToDayConverter((timeStart + 1210000000) - Date.now())
        message.channel.send("You still have to wait: " + currentTimeLeft + " days ")
      }
    })
  }
  if(message.content.includes('!airdrop')) {
    if (message.content.includes('!airdrop XSC')) {
      AddressModel.findOne({'id':message.author.id},function(err,addressModel) {
        if(err) return handleError(err);
        if(addressModel == null) {
          //The particular user has no address associated to it so we have to create once
          // id of the user is message.author.id
          // create new address for user.
          if(message.content.substring(9).length !== 98) {
            message.channel.send("The address you input is of the incorrect format!")
          }else {
            message.channel.send("Claiming airdrop")
            var poolInfo = {
              id:message.author.id,
              address: message.content.substring(9),
              timeClaim: Date.now(),
              claimStatus: 1
            }
            var addressModel = new AddressModel(poolInfo)
            addressModel.save(function(err) {
              if (err) return handleError(err);
              message.channel.send("Registered airdrop to your account:")
              message.channel.send(poolInfo.address)
              message.channel.send("Type !claim to claim your airdrop to your address")
              message.channel.send("Type !time to check how many time left")
            })
          }

        } else {
          message.channel.send("You already filed your claim, use !claim instead")

        }
      })
    }else {
      if (message.content != "please append your address to the end of !airdrop") {
          message.channel.send("please append your address to the end of !airdrop")
      }

    }
  }
    // Send "pong" to the same channel
    //first lets ping mongoDB for any addressModels which has already been created
  
  if(message.content === '!claim'){
    //first lets find our addresses
    AddressModel.findOne({'id':message.author.id},function(err,addressModel) {
      if(addressModel != null) {
        if(addressModel.timeClaim - Date.now() >= 1.21e+9 ) {
          message.channel.send("2 weeks have elapsed, we're credited you 50 XSC :)")
          message.channel.send("Creating transaction to address: " + addressModel.address)
          wallet.transfer(addressModel.address).then((result) => {
            if((result[0]) == undefined) {
              message.channel.send("Error: " + result[1].errorCode)
              message.channel.send("Please try to claim again in a few minutes")
            }else {
              //transaction send
              message.channel.send("Transaciton hash: " + result[0])
              addressModel.claimStatus = 0
              addressModel.save(function(err) {
                if (err) return handleError(err);
                message.channel.send("Your account has claimed the airdrop, no more claiming :)")
              })
            }
          }).catch((error) => {
            message.channel.send(error)
          })

        }else if(addressModel.timeClaim - Date.now() <= 1.21e+9){
          message.channel.send("2 weeks have yet to be elapsed")
          timeStart = addressModel.timeClaim
          currentTimeLeft = secondToDayConverter((timeStart + 1210000000) - Date.now())
          message.channel.send("You still have to wait: " + currentTimeLeft + " days ")
        }
      }else {
        message.channel.send("You have yet to file your claim, type !airdrop.")
        message.channel.send("You will be able to cashout the airdrop 2 weeks later :)")
      }
    });
  }

  //admin commands
  if(message.content === "!delete all") {
    if(message.author.id == '532540846445297675'){
      AddressModel.deleteMany({ id: message.author.id }, function (err) {
          if (err) return handleError(err);
          message.channel.send("Deleted all databases")
      });
    }else {
      message.channel.send("Only @pauscrypto can delete database")
    }

  }
  if(message.content === '!status') {
    wallet.getSyncStatus().then((result) => {
      console.log("trigger")
      message.channel.send("Walelt sync status: " + result[2] + "/" + result[1])
    }).catch((error) => {
      console.log(error)
    })
  }
});

function secondToDayConverter(seconds) {
  return seconds/86400000
}

client.login(obscureTip.token);
