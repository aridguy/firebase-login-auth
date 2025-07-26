import React, { useState } from 'react'
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from 'firebase/auth'
import { auth, provider } from './firebase'
import { useNavigate } from 'react-router-dom';

const Logins = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userName, setUserName] = useState(null)
  const [error, setError] = useState('')

  // Google login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      setUserName(user.displayName)
      alert(`Welcome ${user.displayName}`)
      // Navigate to /chats and pass displayName to Chats page
      navigate('/chats', { state: { userName: user.displayName } })
    } catch (error) {
      console.error('Google Sign-In Error:', error.message)
      setError(error.message)
    }
  }

  // Email login
  const handleEmailLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      const user = result.user
      setUserName(user.email)
      navigate('/chats', { state: { userName: user.email } }) // Pass email as userName
      setEmail('')
      setPassword('')
      setError('')
      alert(`Welcome ${user.email}`)
    } catch (error) {
      console.error('Email Login Error:', error.message)
      setError('Invalid email or password')
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setUserName(null)
      setEmail('')
      setPassword('')
      setError('')
    } catch (error) {
      console.error('Logout Error:', error.message)
    }
  }

  return (
    <div
      style={{
        textAlign: 'center',
        marginTop: '80px',
        maxWidth: '400px',
        margin: '80px auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}
    >
      <h2>Login to Chat App</h2>

      {userName ? (
        <>
          <h4>Welcome, {userName}!</h4>
          <button onClick={handleLogout} className='btn btn-danger mt-3'>
            Logout
          </button>
        </>
      ) : (
        <>
          <div className='mb-3'>
            <input
              type='email'
              className='form-control'
              placeholder='Email'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className='mb-3'>
            <input
              type='password'
              className='form-control'
              placeholder='Password'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleEmailLogin}
            className='btn btn-primary w-100 mb-3'
          >
            Login with Email
          </button>

          <p>or</p>

          <button
            onClick={handleGoogleLogin}
            className='btn btn-light w-100 shadow-sm border rounded-pill'
          >
            <img
              src='https://img.icons8.com/color/48/000000/google-logo.png'
              alt='Google Logo'
              width='20'
              height='20'
              className='me-2'
            />
            Sign in with Google
          </button>

          {error && <p className='text-danger mt-3'>{error}</p>}
        </>
      )}
    </div>
  )
}

export default Logins