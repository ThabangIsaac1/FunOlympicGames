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

    auth.createUser(
           {
              email: email,
              emailVerified: false,
              password: "123456",
              country: country,
              displayName: fullName,
              disabled: false,
              customClaims: { roleId: 1 }
             }
     
        ).then(() => {
          console.log("success");  

          // Email send to:

          return res.status(202).json("email sent!")          

        }).catch(error=>{
          console.log(error)
          return res.status(500).json(error)  
            
        });

   
    


})


exports.app = functions.https.onRequest(app)
