const functions = require("firebase-functions");
const express = require('express')

const app = express()

const bodyParser = require('body-parser')
const https = require('https')
const admin = require('firebase-admin')

//const cron = require('node-cron');

const serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://reib-platform.firebaseio.com',
})

const auth = admin.auth()
const db = admin.firestore()

const allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
}

app.use(allowCrossDomain)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/api/register', (req, res) => {


    const {email, fullName, country} = req.body;

    // auth.createUser(
    //        {
    //           email: email,
    //           emailVerified: false,
    //           password: "123456",
    //           country: country,
    //           displayName: fullName,
    //           disabled: false,
    //           customClaims: { roleId: 1 }
    //          }
     
    //     ).then(() => {
    //        console.log("success");      
    //     }).catch(error=>{
    //         console.log(error)
    //     });

    var actionCodeSettings = {
      url:
        ' https://bamb-leads.firebaseapp.com/user/reset-password?mode=<action>&oobCode=<code>', //enter the url of homepage which you want to sent to user's email.
      handleCodeInApp: true,
    };

    auth
      .sendPasswordResetEmail(email, actionCodeSettings)

      .then(function () {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem('emailForSignIn', email);
        NotificationManager.primary(
          'Email Succesfully Sent.',
          'Email Confirmation To User',
          3000,
          null,
          null
        );
      })
      .catch(function (error) {
        console.log(error);
        alert('failed....');
        // Some error occurred, you can inspect the code: error.code
      });
    


})


exports.app = functions.https.onRequest(app)
