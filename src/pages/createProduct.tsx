import axios from 'axios'
import '../styles/createProduct.css'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CreateProduct: React.FC = () => {
  const [name, setName] = useState<string>('')
  const [image, setImage] = useState<string>('')
  const [value, setValue] = useState<number | ''>('')
  const [count, setCount] = useState<number | ''>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [description, setDescription] = useState<string>('')

  const navigate = useNavigate()

  const convertToBase64 = (imageUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      fetch(imageUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const reader = new FileReader()
          reader.readAsDataURL(blob)
          reader.onloadend = () => {
            const base64data = reader.result as string
            const base64WithoutPrefix = base64data.split(',')[1]
            resolve(base64WithoutPrefix)
          }
          reader.onerror = (error) => reject(error)
        })
        .catch((error) => reject(error))
    })
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!image || !name || !description || !value || !count) {
      setError('Por favor complete todos los campos.')
      return
    }

    setError(null)
    setLoading(true)

    try {
      const data = await convertToBase64(image)
      const response = await axios.post('http://localhost:8080/api/v1/ecommerce/product', {
        base64: data,
        name,
        description,
        value,
        count
      })
      if (response.data.status.code === '200') {
        alert('Producto creado exitosamente!')
        navigate('/home')
      } else {
        setError('Hubo un error al crear el producto. Intenta de nuevo.')
      }
    } catch (error) {
      setError('Hubo un error al crear el producto. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='create-product-container'>
      <h1>Crear Producto</h1>
      <form onSubmit={handleSubmit} className='create-product-form'>
        {error && <p className='error'>{error}</p>}
        <label>
          Imagen URL:
          <input
            type='text'
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder='URL de la imagen'
          />
        </label>
        <label>
          Nombre:
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Nombre del producto'
          />
        </label>
        <label>
          Descripción:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Descripción del producto'
          />
        </label>
        <label>
          Cantidad:
          <input
            type='number'
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            placeholder='Valor del producto'
          />
        </label>
        <label>
          Valor:
          <input
            type='number'
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            placeholder='Valor del producto'
          />
        </label>
        <button type='submit' className='create-button' disabled={loading}>
          {loading ? 'Creando...' : 'Crear Producto'}
        </button>
      </form>
    </div>
  )
}

export default CreateProduct
