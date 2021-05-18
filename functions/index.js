const functions = require('firebase-functions')
const express = require('express')

const app = express()

const bodyParser = require('body-parser')
const https = require('https')
const admin = require('firebase-admin')
const nodemailer = require('nodemailer')
const sgTransport = require('nodemailer-sendgrid-transport')
const axios = require('axios')

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
  const message = `Thank you for registering to attend the Fun Olympic games!! You are one step away from joining the fantastic moment: Kindly follow this link.\n https://funolympic-fnqi.web.app/auth/reset-password?mode=action&oobCode=code `

  auth
    .createUser({
      email: email,
      emailVerified: false,
      password: '123456',
      disabled: false,
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
          // Update Claim
          axios
            .put(
              `https://us-central1-funolympic-fnqi.cloudfunctions.net/app/api/subscriber-claim/${email}`,
            )
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
            })
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

//Post Results
app.post('/api/results', (req, res) => {
  ;(async () => {
    try {
      db.collection('Results').add({
        id: req.body.id,
        gold: req.body.gold,
        silver: req.body.silver,
        bronze: req.body.bronze,
        codeName: req.body.codeName,
      })
      return res.status(202).json({ res: 'success' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ res: 'fail' })
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

// Getting all results
app.get('/api/eventresults', (req, res) => {
  ;(async () => {
    try {
      let query = db.collection('Results')
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


app.put('/api/eventUpdate/:id', (req, res) => {
  ;(async () => {
 
    try {
      let id = req.params.id
      let  dateScheduled = req.body. dateScheduled
      let eventLocation = req.body.eventLocation
      let countriesParticipating = req.body.countriesParticipating
      let eventDescription = req.body.eventDescription

      let query = db.collection('Events')
      let response
      await query.get().then((querySnapshot) => {
        let docs = querySnapshot.docs
        for (let doc of docs) {
          if (doc.id === id) {
            db.doc(`Events/${doc.id}`).update({
              dateScheduled: dateScheduled,
             eventLocation:eventLocation,
             eventDescription:eventDescription,
             countriesParticipating:countriesParticipating,
             
            })
            response = {
              status: 'successs',
            }
            break
          } else {
            response = {
              status: 'not successful',
            }
          }
        }
      })
      return res.status(200).json({ response })
    } catch (error) {
      // console.log(error)
      return res.status(500).send(error)
    }
  })()
})




// Getting all subscribers
app.get('/api/subscribers', (req, res) => {
  ;(async () => {
    try {
      let query = db.collection('subscribers')
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


/*Forort Password Send Message*/
app.post('/api/send-reset', (req, res) => {
  const { email }= req.body
  const messages = `Kindly follow this link to reset your password.\n https://funolympic-fnqi.web.app/auth/reset-password?mode=action&oobCode=code `

  // Email send to:
  transporter.sendMail({
    to: `${email}`,
    from: 'funolympic.fnqi@gmail.com',
    subject: `Password Reset For: ${email}`,
    message: messages,
    html: `<div>
    <h4>Dear FunOlympics User,</h4>   
    <p>${messages || ''}</p>
   
    </div>`,
  })
})
/*Forort Password Send Message*/

//updating a specific sporting code
app.put('/api/update_code', (req, res) => {
  ;(async () => {
    console.log(req.body)
    try {
      let eventId = req.body.id
      let codeName = req.body.codeName
      let category = req.body.category
      let eventLocation = req.body.eventLocation

      let query = db.collection('Events')
      let response
      await query.get().then((querySnapshot) => {
        let docs = querySnapshot.docs
        for (let doc of docs) {
          if (doc.id === eventId) {
            db.doc(`Events/${doc.id}`).update({
              codeName: codeName,
              category: category,
              eventLocation: eventLocation,
            })
            response = {
              status: 'successs',
            }
            break
          } else {
            response = {
              status: 'not successful',
            }
          }
        }
      })
      return res.status(200).json({ response })
    } catch (error) {
      console.log(error)
      return res.status(500).send(error)
    }
  })()
})

//change status of  a specific sporting code
app.put('/api/ended', (req, res) => {
  ;(async () => {
    console.log(req.body)
    try {
      let eventId = req.body.id
      let status = req.body.codeName

      let query = db.collection('Events')
      let response
      await query.get().then((querySnapshot) => {
        let docs = querySnapshot.docs
        for (let doc of docs) {
          if (doc.id === eventId) {
            db.doc(`Events/${doc.id}`).update({
              status: 'Event Ended',
            })
            response = {
              status: 'successs',
            }
            break
          } else {
            response = {
              status: 'not successful',
            }
          }
        }
      })
      return res.status(200).json({ response })
    } catch (error) {
      console.log(error)
      return res.status(500).send(error)
    }
  })()
})
//Deleting a specific sporting code
app.delete('/api/events/:id', (req, res) => {
  ;(async () => {
    const id = req.params.id
    try {
      const document = db.collection(`Events`).doc(id)
      await document.delete()
      return res.status(200).send('Successufully Deleted')
    } catch (error) {
      console.log(error)
      return res.status(500).send()
    }
  })()
})

app.post('/api/eventComments', (req, res) => {
  ;(async () => {
    try {
      db.collection('Comments').add({
        id: req.body.id,
        fullName: req.body.fullName,
        comment: req.body.comment,
     //   eventDescription: req.body.eventDescription,
    //    status: 'Upcoming',
      })
      return res.status(202).json({ res: 'success' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ res: 'fail' })
    }
  })()
})

app.get('/api/eventComments', (req, res) => {
  ;(async () => {
    try {
      let query = db.collection('Comments')
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

exports.app = functions.https.onRequest(app)
