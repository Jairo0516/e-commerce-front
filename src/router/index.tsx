import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'

import Home from '../pages/home'
import Login from '../pages/login'
import EditProduct from '../pages/editProduct'
import CreateProduct from '../pages/createProduct'

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/login' />} />
        <Route path='/login' element={<Login />} />
        <Route path='/home' element={<Home />} />
        <Route path='/createProduct' element={<CreateProduct />} />
        <Route path="/editProduct/:id" element={<EditProduct />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router