import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../component/Home'
import Login from '../component/Login'
import Interest from '../component/Interest'

const AllRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path='/'element={<Home/>}/>
        <Route path='/interest'element={<Interest/>}/>
      </Routes>
    </div>
  )
}

export default AllRoutes
