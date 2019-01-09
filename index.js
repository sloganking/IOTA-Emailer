var IOTA = require("iota.lib.js");
var nodemailer = require("nodemailer");
const fs = require("fs");

var transporter = nodemailer.createTransport({
  service: "gmail", //the email service you would like to use
  auth: {
    user: "ExampleSenderEmail@gmail.com", //change this to your email username
    pass: "ExampleSenderPassword" //change this to your email password
  }
});

// Create IOTA instance directly with provider
var iota = new IOTA({
  provider: "https://field.carriota.com:443" //any IOTA node will do
});

seed = "ExampleIOTASeed"; //change this to the seed of the wallet you would like to monitor

async function runTheThing() {
  console.log("Waiting...");
  setTimeout(function() {
    console.log("Running...");
    iota.api.getInputs(seed, [], (err, inputs) => {
      //if(err) throw err;
      console.log("curBal: ", inputs.totalBalance);
      curBal = inputs.totalBalance;

      fs.readFile("./Text/Balance.txt", "utf8", (err, pastBal) => {
        //if (err) throw err;
        console.log("pastBal: ", pastBal);

        if (curBal != pastBal) {
          console.log("Balance difference, writing file...");
          fs.writeFile("./Text/Balance.txt", curBal, "utf8", err => {
            //if (err) throw err;
            console.log("The file has been saved!");

            messageString = "IOTA Balance updated to: " + curBal + "i";
            var mailOptions = {
              from: "ExampleSenderEmail@gmail.com",
              to: "ExampleReceiverEmail@gmail.com",
              subject: "IOTA Balance updated",
              text: messageString
            };

            transporter.sendMail(mailOptions, function(error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log("Email sent: " + info.response);
              }
              runTheThing();
            });
          });
        } else {
          runTheThing();
        }
      });
    });
  }, 10000);
}

//runTheThing();

async function run() {
  console.log("Waiting...");
  //let variable = await setTimeout(10000);
  console.log("Running...");
  let inputs = await iota.api.getInputs(seed, [], (err, inputs) => {});
  console.log(inputs);
}

run();
