import axios from 'axios'
import '../styles/createProduct.css'
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const EditProduct: React.FC = () => {
  const [name, setName] = useState<string>('')
  const [image, setImage] = useState<string>('')
  const [count, setCount] = useState<number | ''>('')
  const [value, setValue] = useState<number | ''>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [description, setDescription] = useState<string>('')

  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/ecommerce/product/${id}`)
        const product = response.data.productDTO
        setImage(product.image)
        setName(product.name)
        setDescription(product.description)
        setValue(product.value)
        setCount(product.count)
      } catch (error) {
        console.error('Error al obtener el producto', error)
        setError('Hubo un error al obtener los detalles del producto.')
      }
    }

    fetchProduct()
  }, [id])

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
      const response = await axios.put(`http://localhost:8080/api/v1/ecommerce/product`, {
        base64: data,
        name,
        description,
        value,
        count,
        id: parseInt(id ? id?.toString() : '')
      })
      if (response.data.status.code === '200') {
        alert('Producto actualizado exitosamente!')
        navigate('/home')
      } else {
        setError('Hubo un error al actualizar el producto. Intenta de nuevo.')
      }
    } catch (error) {
      console.error('Error al actualizar el producto', error)
      setError('Hubo un error al actualizar el producto. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='create-product-container'>
      <h1>Editar Producto</h1>
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
          {loading ? 'Actualizando...' : 'Actualizar Producto'}
        </button>
      </form>
    </div>
  )
}

export default EditProduct
