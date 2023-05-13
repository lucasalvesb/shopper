import React from 'react'
import { useState } from 'react'
import './App.css'

export default function App() {
  const [file, setFile] = useState<File | null>(null)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const uploadedFile = event.target.files?.[0]
    if (uploadedFile) {
      setFile(uploadedFile)
      setIsButtonDisabled(false)
    } else {
      setFile(null)
      setIsButtonDisabled(true)
    }
  }

  function handleValidation() {
    if (file) {
      // validação
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
    </div>
  )
}
