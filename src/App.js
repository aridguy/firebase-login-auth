import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Logins from './Logins'
import Chats from './Chats'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Logins />} />
          <Route path='chats' element={<Chats />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
