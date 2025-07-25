import React from 'react'

function Dashboard({ onLogout }) {
  return (
    <div>
      <h1>Dashboard Page</h1>
      <button onClick={onLogout}>
        Go to Loginsss
      </button>
    </div>
  )
}

export default Dashboard