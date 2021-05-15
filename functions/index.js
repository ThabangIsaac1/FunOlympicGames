const functions = require('firebase-functions')
const express = require('express')

const app = express()

const bodyParser = require('body-parser')
const https = require('https')
const admin = require('firebase-admin')
const nodemailer = require('nodemailer')
const sgTransport = require('nodemailer-sendgrid-transport')

//const cron = require('node-cron');

const transporter = nodemailer.createTransport(
  sgTransport({
    auth: {
      api_key:
        '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',
    },
  }),
)

const serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://funolympic-fnqi.firebaseio.com',
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

/*Endpoint Register User*/
app.post('/api/register', (req, res) => {
  const { email, fullName, country, gender } = req.body
  const message = `Thank you for registering to attend the Fun Olympic games!! You are one step away from joining the fantastic moment: Kindly follow this link.\n https://funolympic-fnqi.firebaseapp.com/auth/reset-password?mode=action&oobCode=code `

  auth
    .createUser({
      email: email,
      emailVerified: false,
      password: '123456',
      //country: country,
      //displayName: fullName,
      disabled: false,
      customClaims: { subscriber: true },
    })
    .then(() => {
      db.collection('subscribers')
        .add({
          email: email,
          fullName: fullName,
          country: country,
          gender: gender,
        })
        .then(() => {
          // Email send to:
          transporter.sendMail({
            to: email,
            from: 'funolympic.fnqi@gmail.com',
            subject: 'Registeration Credentials',
            message: message,
            html: `<div>
            <h4>Dear Fun Olympic user,${fullName}</h4>   
            <p>${message || ''}</p>
            <span>
                Fun Olympic Games Management
            </span>
            </div>`,
          })

          return res.status(202).json({ res: 'success' })
        })
        .catch((error) => {
          console.log(error)
          return res.status(500).json({ res: 'fail' })
        })
    })
    .catch((error) => {
      console.log(error)
      return res.status(500).json({ res: 'fail' })
    })
})
/*Endpoint Register User*/

// Super Admin Claim
app.put('/api/super-admin-claim/:email', (req, res) => {
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

// Olympic Admins Claim
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
app.put('/api/subscriber-claim/:email', (req, res) => {
  ;(async () => {
    let { email } = req.params

    try {
      const user = await auth.getUserByEmail(email)

      auth
        .setCustomUserClaims(user.uid, {
          subscriber: true,
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

// Post an Event
app.post('/api/events', (req, res) => {
  ;(async () => {
    try {
      db.collection('Events').add({
        codeName: req.body.codeName,
        countriesParticipating: req.body.countriesParticipating,
        dateScheduled: req.body.dateScheduled,
        category: req.body.category,
        eventLocation: req.body.eventLocation,
        virtualLink: req.body.virtualLink,
        eventDescription: req.body.eventDescription,
        status: 'Upcoming',
      })
      return res.status(202).json({ res: 'success' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ res: 'fail' })
    }
  })()
})

// Getting all Events
app.get('/api/events', (req, res) => {
  ;(async () => {
    try {
      let query = db.collection('Events')
      let response = []
      await query.get().then((querySnapshot) => {
        let docs = querySnapshot.docs
        for (let doc of docs) {
          const selectedItem = {
            id: doc.id,
            ...doc.data(),
          }
          response.push(selectedItem)
        }
      })
      return res.status(200).send(response)
    } catch (error) {
      console.log(error)
      return res.status(500).send(error)
    }
  })()
})

// Getting a Specific Event
app.get('/api/events/:id', (req, res) => {
  ;(async () => {
    try {
      let id = req.params.id
      let query = db.collection('Events').doc(id)
      let response = {}
      await query.get().then((querySnapshot) => {
        let doc = querySnapshot
        const selectedItem = {
          id: doc.id,
          ...doc.data(),
        }
        response = selectedItem
      })
      return res.status(200).send(response)
    } catch (error) {
      console.log(error)
      return res.status(500).send(error)
    }
  })()
})

/*Endpoint Send Message*/
app.post('/api/send-message', (req, res) => {
  const { email, fullName, message } = req.body
  //const message = `Thank you for registering to attend the Fun Olympic games!! You are one step away from joining the fantastic moment: Kindly follow this link.\n https://funolympic-fnqi.firebaseapp.com/auth/reset-password?mode=action&oobCode=code `

  // Email send to:
  transporter.sendMail({
    to: 'funolympic.fnqi@gmail.com',
    from: 'funolympic.fnqi@gmail.com',
    subject: `Enquiry from: ${fullName}`,
    message: message,
    html: `<div>
    <h4>Dear admin,</h4>   
    <p>${message || ''}</p>
    <span>
        Reply to: ${email}
    </span>
    </div>`,
  })
})
/*Endpoint Send Message*/

exports.app = functions.https.onRequest(app)
