import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import axios from 'axios'
import ProductTable from './Tabela.tsx'

export default function App() {
  const effectRan = useRef(false)
  const [file, setFile] = useState<File | null>(null)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const [responseMessage, setResponseMessage] = useState('')
  const [productData, setProductData] = useState([])
  const [products, setProducts] = useState<Product[]>([])
  
type Product = {
  product_code: string
  name: string
  sales_price: number
  new_price: number
}

useEffect(() => {
  async function fetchData() {
    if (products.length === 0) {
      return // não faça a call de api até estar populado
    }
    if (effectRan.current === false) {
      const response = await axios.get<Product[]>('http://localhost:5173/uploads')
      setProducts(response.data)
    }
  }
  fetchData()
}, [products])

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const uploadedFile = event.target.files?.[0]
    if (uploadedFile) {
      if (!uploadedFile.name.endsWith('.csv')) {
        alert('Por favor, envie um arquivo CSV')
        event.target.value = '' // reset the file input field
        setFile(null)
        setIsButtonDisabled(true)
      } else {
        setFile(uploadedFile)
        setIsButtonDisabled(false)
      }
    }
  }

  function handleValidation() {
    if (file) {
      const formData = new FormData()
      formData.append('file', file)

      axios
        .post('http://localhost:5173/uploads', formData)
        .then((response) => {
          setResponseMessage(response.data.message)
          const products = response.data.results.map((result: any) => ({
            product_code: result.product_code,
            name: '',
            sales_price: 0,
            new_price: result.new_price,
          }))
          setProducts(products)
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }


  function handleUpdate() {
    // update
  }

  return (
    <div>
      <input
        type="file"
        onChange={handleFileUpload}
        className="upload-button"
      />
      <button
        onClick={handleValidation}
        className="action-buttons"
      >
        VALIDAR
      </button>
      <button
        onClick={handleUpdate}
        disabled={isButtonDisabled}
        className="action-buttons"
      >
        ATUALIZAR
      </button>
      {responseMessage && <p>{responseMessage}</p>}
      <div>
        <h1>Product List</h1>
        <ProductTable products={products} />
      </div>
    </div>
  )
}