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
  const [columns, setColumns] = useState<Column[]>([])

  type Product = {
    product_code: number
    name: string
    sales_price: number
    new_price: number
  }

  type Column = {
    code: number
    name: string
    sales_price: number
  }

  useEffect(() => {
    async function fetchData() {
      if (products.length === 0) {
        return // don't make the API call until the products state is populated
      }
      if (effectRan.current === false) {
        effectRan.current = true
        const response = await axios.get<Product[]>(
          'http://localhost:5173/uploads'
        )
        setProducts(response.data)
      }
    }
    fetchData()
  }, [products])

  useEffect(() => {
    async function fetchData() {
      if (columns.length === 0) {
        return // don't make the API call until the columns state is populated
      }
      if (effectRan.current === false) {
        effectRan.current = true
        const response = await axios.get<Column[]>(
          'http://localhost:5173/columns'
        )
        setColumns(response.data)
      }
    }
    fetchData()
  }, [columns])

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const uploadedFile = event.target.files?.[0]
    if (uploadedFile) {
      if (!uploadedFile.name.endsWith('.csv')) {
        alert('Please upload a CSV file')
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
        const results = response.data.results.reduce((acc: any, curr: { product_code: any; new_price: any }) => {
          return { ...acc, [curr.product_code]: curr.new_price }
        }, {})
        axios
          .post('http://localhost:5173/columns')
          .then((response) => {
            const columns = response.data.columns
            const products = columns.map((product: any) => {
              const newPrice = results[product.product_code]
              if (newPrice) {
                return {
                  product_code: product.product_code,
                  name: product.name,
                  sales_price: product.sales_price,
                  new_price: newPrice,
                }
              } else {
                return product
              }
            })
            setProducts(products)
          })
          .catch((error) => {
            console.error(error)
          })
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
        <h1>Lista de produtos</h1>
        <ProductTable products={products} />
      </div>
    </div>
  )
}
