import React, { useState } from 'react'
import './App.css'
import axios from 'axios'

export default function App() {
  const [file, setFile] = useState<File | null>(null)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const [responseMessage, setResponseMessage] = useState('')
  const [productData, setProductData] = useState([])

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
          console.log(response.data)
          setResponseMessage(response.data.message)
          setProductData(response.data)
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
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Sales Price</th>
            <th>New Price</th>
          </tr>
        </thead>
        <tbody>
          {productData.map((product) => (
            <tr key={product.code}>
              <td>{product.code}</td>
              <td>{product.name}</td>
              <td>{product.sales_price}</td>
              <td>{product.new_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}