import React, { useState } from 'react'
import { signInWithPopup, signOut } from 'firebase/auth'
import { auth, provider } from './firebase'

const App = () => {
  const [userName, setUserName] = useState(null)

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      console.log('User Info:', user)
      setUserName(user.displayName)
      alert(`Welcome ${user.displayName}`)
    } catch (error) {
      console.error('Google Sign-In Error:', error.message)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setUserName(null)
    } catch (error) {
      console.error('Logout Error:', error.message)
    }
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Welcome to the App</h1>
      {userName ? (
        <>
          <h2>Hello, {userName}!</h2>
          <button onClick={handleLogout} className='btn btn-danger mt-3'>
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={handleGoogleLogin}
          className='btn btn-light btn-lg align-items-center shadow-sm border rounded-pill'
        >
          <img
            src='https://img.icons8.com/color/48/000000/google-logo.png'
            alt='Google Logo'
            width='24'
            height='24'
          />
          <span className='ms-2'>Sign in with Google</span>
        </button>
      )}
    </div>
  )
}

export default App