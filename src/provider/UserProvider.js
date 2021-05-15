import React, { useState, useEffect } from 'react'
import { auth, firestore } from '../firebase'

export const UserContext = React.createContext()

export default function UserProvider({ children }) {
  let [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    auth.onAuthStateChanged((userAuth) => {
      //console.log(`State changed to ${userAuth}`)

      setCurrentUser(userAuth)

      localStorage.setItem('current-user', JSON.stringify(userAuth))
    })
    // Define user upon page refresh:
    //setUserDetails(JSON.parse(localStorage.getItem('current-user')));
  }, [])

  return (
    <UserContext.Provider value={{ currentUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const UserConsumer = UserContext.Consumer
