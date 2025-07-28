import React, { useEffect, useState, useRef } from 'react'
import { db, auth } from './firebase'
import {
  doc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  orderBy,
  query,
  where
} from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

const getInitials = name => {
  if (!name) return ''
  return name
    .replace(/[^a-zA-Z ]/g, '')
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

const Chats = () => {
  const [onlineUsers, setOnlineUsers] = useState([])
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [darkMode, setDarkMode] = useState(false)
  const messagesEndRef = useRef(null)
  const navigate = useNavigate()

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Fetch messages
  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'))
    const unsubscribe = onSnapshot(q, snapshot => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    })
    return () => unsubscribe()
  }, [])

  // Send message
  const sendMessage = async e => {
    e.preventDefault()
    if (!message.trim()) return

    await addDoc(collection(db, 'messages'), {
      text: message,
      timestamp: serverTimestamp(),
      user: auth.currentUser.displayName || auth.currentUser.email,
      photoURL: ''
    })

    setMessage('')
  }

  // Emoji support (simple)
  const handleEmoji = emoji => setMessage(msg => msg + emoji)

  // Logout with confirmation and feedback
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout'
    })
    if (result.isConfirmed) {
      try {
        await signOut(auth)
        await Swal.fire('Logged out!', 'You have been logged out.', 'success')
        navigate('/')
      } catch (error) {
        Swal.fire('Error', error.message, 'error')
      }
    }
  }

  // Dark mode styles
  const theme = darkMode
    ? {
        background: '#18181b',
        color: '#f3f4f6',
        borderColor: '#27272a',
        inputBg: '#27272a',
        msgBg: '#005c4b',
        msgOtherBg: '#222b45',
        avatarBg: '#6366f1',
        avatarOtherBg: '#64748b',
        btnBg: '#6366f1',
        btnColor: '#fff',
        shadow: '0 2px 8px rgba(0,0,0,0.25)',
        bubbleShadow: '0 2px 8px rgba(0,0,0,0.25)'
      }
    : {
        background: '#ece5dd',
        color: '#22223b',
        borderColor: '#e3e8f0',
        inputBg: '#fff',
        msgBg: '#d9fdd3', // WhatsApp green
        msgOtherBg: '#fff',
        avatarBg: '#4f8cff',
        avatarOtherBg: '#64748b',
        btnBg: '#3b82f6',
        btnColor: '#fff',
        shadow: '0 2px 8px rgba(0,0,0,0.08)',
        bubbleShadow: '0 1px 2px rgba(0,0,0,0.08)'
      }

  // On mount, set user online
  useEffect(() => {
    const userRef = doc(db, 'users', auth.currentUser.uid)
    setDoc(
      userRef,
      {
        name: auth.currentUser.displayName || auth.currentUser.email,
        online: true,
        lastActive: serverTimestamp()
      },
      { merge: true }
    )

    // On disconnect or unmount, set user offline
    return () => {
      updateDoc(userRef, { online: false, lastActive: serverTimestamp() })
    }
  }, [])

  // Listen for online users
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'users'), where('online', '==', true)),
      snapshot => {
        setOnlineUsers(snapshot.docs.map(doc => doc.data().name))
      }
    )
    return () => unsubscribe()
  }, [])

  return (
    <div
      className={`container-fluid py-4 ${
        darkMode ? 'bg-dark text-light' : 'bg-light text-dark'
      }`}
      style={{
        minHeight: '100vh',
        transition: 'background 0.3s, color 0.3s',
        fontFamily: 'Segoe UI, sans-serif',
        background: theme.background
      }}
    >
      <div className='row justify-content-center'>
        <div className='col-12 col-md-8 col-lg-6'>
          <div
            className='card shadow-lg'
            style={{
              background: theme.background,
              color: theme.color,
              borderRadius: 18,
              border: `1px solid ${theme.borderColor}`,
              minHeight: 600,
              boxShadow: theme.shadow
            }}
          >
            <div
              className='card-header d-flex justify-content-between align-items-center'
              style={{
                background: 'transparent',
                borderBottom: `1px solid ${theme.borderColor}`
              }}
            >
              <h4 className='mb-0'>💬 Chat Room</h4>
              <div className='d-flex align-items-center gap-2'>
                <button
                  onClick={() => setDarkMode(d => !d)}
                  className={`btn btn-sm ${
                    darkMode ? 'btn-light' : 'btn-dark'
                  } me-2`}
                  title='Toggle dark mode'
                  style={{ borderRadius: 20 }}
                >
                  {darkMode ? '🌙' : '☀️'}
                </button>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: theme.avatarBg,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    textTransform: 'uppercase'
                  }}
                >
                  {getInitials(
                    auth.currentUser.displayName || auth.currentUser.email
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className='btn btn-danger btn-sm ms-2'
                  style={{ borderRadius: 20, fontWeight: 'bold' }}
                >
                  Logout
                </button>
              </div>
            </div>

            <div
              className='card-body d-flex flex-column'
              style={{
                background: theme.background,
                borderRadius: 18,
                padding: '1rem',
                minHeight: 400,
                maxHeight: 400,
                overflowY: 'auto',
                border: `1px solid ${theme.borderColor}`,
                marginBottom: 8,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end'
              }}
            >
              <div className='d-flex flex-column' style={{ width: '100%' }}>
                {messages.map(msg => {
                  const isCurrentUser =
                    (auth.currentUser.displayName &&
                      msg.user === auth.currentUser.displayName) ||
                    msg.user === auth.currentUser.email
                  return (
                    <div
                      key={msg.id}
                      className={`d-flex mb-2 ${
                        isCurrentUser
                          ? 'justify-content-end'
                          : 'justify-content-start'
                      }`}
                      style={{ alignItems: 'flex-end' }}
                    >
                      {!isCurrentUser && (
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            marginRight: 8,
                            background: theme.avatarOtherBg,
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '0.95rem',
                            textTransform: 'uppercase'
                          }}
                        >
                          {getInitials(msg.user)}
                        </div>
                      )}
                      <div
                        className='px-3 py-2'
                        style={{
                          background: isCurrentUser
                            ? theme.msgBg
                            : theme.msgOtherBg,
                          borderRadius: isCurrentUser
                            ? '16px 16px 4px 16px'
                            : '16px 16px 16px 4px',
                          marginLeft: isCurrentUser ? 'auto' : 0,
                          marginRight: isCurrentUser ? 0 : 'auto',
                          maxWidth: '75%',
                          color: isCurrentUser ? '#0f5132' : '#111827',
                          wordBreak: 'break-word',
                          boxShadow: isCurrentUser
                            ? '0 1px 4px rgba(0, 0, 0, 0.1)'
                            : '0 1px 4px rgba(0, 0, 0, 0.06)',
                          fontSize: '0.95rem'
                        }}
                      >
                        <strong style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                          {msg.user}
                        </strong>
                        <p className='mb-0' style={{ marginTop: 4 }}>
                          {msg.text}
                        </p>
                      </div>

                      {isCurrentUser && (
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            marginLeft: 8,
                            background: theme.avatarBg,
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '0.95rem',
                            textTransform: 'uppercase'
                          }}
                        >
                          {getInitials(msg.user)}
                        </div>
                      )}
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className='px-3 pb-2'>
              <div className='d-flex gap-2 mb-2'>
                {/* Emoji support */}
                {['😀', '😂', '😍', '👍', '🎉', '🔥', '🙏', '😎'].map(emoji => (
                  <button
                    key={emoji}
                    type='button'
                    onClick={() => handleEmoji(emoji)}
                    className='btn btn-light btn-sm'
                    style={{
                      fontSize: '1.3rem',
                      borderRadius: '50%',
                      padding: 0,
                      width: 36,
                      height: 36,
                      lineHeight: '36px'
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <form
                onSubmit={sendMessage}
                className='d-flex align-items-center'
                autoComplete='off'
              >
                <input
                  type='text'
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder='Type your message...'
                  className='form-control'
                  style={{
                    borderRadius: 20,
                    background: theme.inputBg,
                    color: theme.color,
                    border: `1px solid ${theme.borderColor}`,
                    marginRight: 10
                  }}
                />
                <button
                  type='submit'
                  className='btn'
                  style={{
                    background: theme.btnBg,
                    color: theme.btnColor,
                    borderRadius: 20,
                    fontWeight: 'bold',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                  }}
                >
                  Send
                </button>
              </form>
            </div>

            <div className='px-3 pb-2'>
              <div className='mb-2'>
                <strong>Online:</strong>
                <ul className='list-inline mb-0'>
                  {onlineUsers.map((name, idx) => (
                    <li
                      key={idx}
                      className='list-inline-item badge bg-success text-light mx-1'
                      style={{ fontSize: '1em', borderRadius: 12 }}
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chats
