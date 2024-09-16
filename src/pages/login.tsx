import axios from 'axios'
import '../styles/login.css'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(String(email).toLowerCase())
  }

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Por favor, completa todos los campos.')
      return
    }

    if (!validateEmail(email)) {
      setErrorMessage('Por favor, ingresa un correo válido.')
      return
    }

    setLoading(true)

    try {
      const response = await axios.post('http://localhost:8080/api/v1/ecommerce/auth', {
        email: email,
        password: password,
      })

      const token = response.data.token
      if (token) {
        localStorage.setItem('token', token)
        localStorage.setItem('rol', response.data.rol)
        navigate('/home')
      } else {
        setErrorMessage(response.data.statusDTO.message)
      }
    } catch (error) {
      setErrorMessage('Error al iniciar sesión. Verifica tus credenciales.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='login-container'>
      <div className='login-box'>
        <h2 className='login-title'>Iniciar Sesión</h2>
        {errorMessage && <p className='error-message'>{errorMessage}</p>}
        <input
          type='email'
          placeholder='Correo electrónico'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='login-input'
        />
        <input
          type='password'
          placeholder='Contraseña'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='login-input'
        />
        <button className="login-button" onClick={handleLogin} disabled={loading}>
          {loading ? <div className="spinner"></div> : "Ingresar"}
        </button>
      </div>
    </div>
  )
}

export default Login
