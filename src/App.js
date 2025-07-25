import React from 'react'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from './firebase'
const App = () => {
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      alert(`Welcome ${user.displayName}`)
      // You can redirect or store the user info here
    } catch (error) {
      console.error('Google Sign-In Error:', error.message)
    }
  }
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Welcome to the App</h1>
      
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
        <span className=''>Sign in with Google</span>
      </button>
    </div>
  )
}
export default App
