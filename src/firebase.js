import firebase from 'firebase/app'
import firebase2 from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCxzehKp9OrZVmn5Gy_61eYehtrC-bPigg",
  authDomain: "funolympic-fnqi.firebaseapp.com",
  projectId: "funolympic-fnqi",
  storageBucket: "funolympic-fnqi.appspot.com",
  messagingSenderId: "761303654545",
  appId: "1:761303654545:web:ef9d6d4cea340c3c8e9f30",
  measurementId: "G-RHQ32FHD82"
};

firebase.initializeApp(firebaseConfig)

export const logAction = (email, action, region) => {
  const currentdate = new Date()
  const datetime =
    currentdate.getDate() +
    '/' +
    (currentdate.getMonth() + 1) +
    '/' +
    currentdate.getFullYear() +
    ' @ ' +
    currentdate.getHours() +
    ':' +
    currentdate.getMinutes() +
    ':' +
    currentdate.getSeconds()

  // Firestore function to activity by user:
  firebase
    .firestore()
    .collection('activity_log')
    .doc()
    .set({
      user: email,
      action: action,
      region: region,
      time: datetime,
    })
    .then(() => {
      console.log('Document successfully written!')
    })
    .catch((error) => {
      console.error('Error writing document: ', error)
    })
}
export const auth = firebase.auth()
export const firestore = firebase.firestore()
export const storage = firebase.storage()

export const firebaseApp = firebase2.initializeApp(
  firebaseConfig,
  'create-user',
)


