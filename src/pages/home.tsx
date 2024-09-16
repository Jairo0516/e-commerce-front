import axios from 'axios'
import '../styles/home.css'
import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'

interface Product {
  id: number
  name: string
  value: number
  image: string
  description: string
}

const Home: React.FC = () => {
  const navigate = useNavigate()

  const [role, setRole] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [products, setProducts] = useState<Product[]>([])
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null)

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/ecommerce/product')
      setProducts(response.data.productDTOS)
    } catch (error) {
      console.error('Error al traer los productos', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()

    const storedRole = localStorage.getItem('rol')
    if (storedRole) {
      setRole(storedRole)
    }
  }, [])

  const handleCreateProductClick = () => {
    navigate('/createProduct')
  }

  const handleEditClick = (product: Product) => {
    navigate(`/editProduct/${product.id}`)
  }

  const handleDeleteClick = async (productId: number) => {
    setDeletingProductId(productId)
    try {
      const response = await axios.delete(`http://localhost:8080/api/v1/ecommerce/product`, { data: { id: productId } })
      if (response.data.status.code === '200') {
        alert('Producto eliminado exitosamente!')
        fetchProducts()
      } else {
        alert('Hubo un error al eliminar el producto. Intenta de nuevo.')
      }
    } catch (error) {
      console.error('Error al eliminar el producto', error)
      alert('Hubo un error al eliminar el producto. Intenta de nuevo.')
    } finally {
      setDeletingProductId(null)
    }
  }

  if (loading) {
    return <p>Cargando productos...</p>
  }

  return (
    <div className='home-container'>
      <div className='header'>
        <h1 className='title'>Productos</h1>
        {role === 'Admin' && (
          <button className='create-button' onClick={handleCreateProductClick}>Crear nuevo producto</button>
        )}
      </div>
      <div className='product-grid'>
        {products.map((product) => (
          <div key={product.id} className='product-card'>
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>Precio: ${product.value}</p>
            <p className='description'>{product.description}</p>
            {role === 'Admin' && (
              <div className='button-group'>
                <button
                  className='edit-button'
                  onClick={() => handleEditClick(product)}
                >
                  Editar
                </button>
                <button
                  className='delete-button'
                  onClick={() => handleDeleteClick(product.id)}
                  disabled={deletingProductId === product.id}
                >
                  {deletingProductId === product.id ? (
                    <span className='loader'></span>
                  ) : (
                    'Eliminar'
                  )}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
