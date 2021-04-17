import React, { useState, useEffect } from 'react'
import { auth, firestore } from '../firebase'

export const UserContext = React.createContext()

export default function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userDetails, setUserDetails] = useState({})

  useEffect(() => {
    auth.onAuthStateChanged((userAuth) => {
      setCurrentUser(userAuth)

      // Get User Document:
      let docRef = firestore.collection('users').doc(userAuth.email)

      docRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            setUserDetails(doc.data())

            //console.log(doc.data())
            // Store user locally
            //localStorage.setItem('current-user', JSON.stringify(doc.data()))
          } else {
            console.log('No such document!')
          }
        })
        .catch((error) => {
          console.log('Error getting document:', error)
        })
    })
    // Define user upon page refresh:
    //setUserDetails(JSON.parse(localStorage.getItem('current-user')));
  }, [])

  return (
    <UserContext.Provider value={{ currentUser, userDetails }}>
      {children}
    </UserContext.Provider>
  )
}

export const UserConsumer = UserContext.Consumer
