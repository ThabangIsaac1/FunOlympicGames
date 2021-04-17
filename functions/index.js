const functions = require("firebase-functions");
const express = require("express");

const app = express();

const bodyParser = require("body-parser");
const https = require("https");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");


//const cron = require('node-cron');

const transporter = nodemailer.createTransport(
  sgTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

const serviceAccount = require("./serviceAccountKey.json");

 admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://funolympic-fnqi.firebaseio.com',
 });

const auth = admin.auth();
const db = admin.firestore();

const allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};

app.use(allowCrossDomain);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/*Endpoint Register User*/
app.post("/api/register", (req, res) => {
  const { email, fullName, country } = req.body;
  const message =`Thank you for registering to attend the Fun Olympic games!! You are one step away from joining the fantastic moment: Kindly follow this link.\n https://funolympic-fnqi.firebaseapp.com/auth/reset-password?mode=action&oobCode=code `

  ;(async () => {
    try {
  
      auth
      .createUser({
        email: email,
        emailVerified: false,
        password: "123456",
        country: country,
        displayName: fullName,
        disabled: false,
        customClaims: { roleId: 1 },
      }) .then(() => {
        console.log("success");
  
        // Email send to:
         transporter.sendMail({
          to: email,
          from: "funolympic.fnqi@gmail.com",
          subject: "Registeration Credentials",
          message: message,
          html: `<div>
       <h4>Dear Fun Olympic user,${fullName}</h4>   
       <p>${message || ""}</p>
       <span>
          Fun Olympic Games Management
       </span>
       </div>`,
        });
        return res.status(202).json("email sent!");
      })

      console.log(message)
    }catch (error) {
      console.log(error)
      return res.status(500).send()
    }
  })()
 });
/*Endpoint Register User*/


// Reib Admin Claim
app.put('/api/olympic-admin-claim/:email', (req, res) => {
  ;(async () => {
    let { email } = req.params

    try {
      const user = await auth.getUserByEmail(email)

      auth
        .setCustomUserClaims(user.uid, {
          olympicAdmin: true,
        })
        .then(() => {
          return res.status(200).send('Claim changed!')
        })
    } catch (error) {
      console.log(error)
      return res.status(500).send(error)
    }
  })()
})
// Olympic Admins Claim
app.put('/api/olympic-claim/:email', (req, res) => {
  ;(async () => {
    let { email } = req.params

    try {
      const user = await auth.getUserByEmail(email)

      auth
        .setCustomUserClaims(user.uid, {
          super: true,
        })
        .then(() => {
          return res.status(200).send('Claim changed!')
        })
    } catch (error) {
      console.log(error)
      return res.status(500).send(error)
    }
  })()
})
// Retrieve Claim
app.get('/api/retrieve-claim/:email', (req, res) => {
  ;(async () => {
    let { email } = req.params

    try {
      const claims = await (await auth.getUserByEmail(email)).customClaims

      return res.status(200).send(claims)
    } catch (error) {
      console.log(error)
      return res.status(500).send(error)
    }
  })()
})







exports.app = functions.https.onRequest(app);
