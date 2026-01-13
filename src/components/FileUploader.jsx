import { useState, useRef } from 'react'
import './FileUploader.css'

function FileUploader({ onSendFile }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [fileType, setFileType] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Verifica tamanho (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Arquivo muito grande! Máximo: 10MB')
      return
    }

    setSelectedFile(file)

    // Determina o tipo
    const type = file.type.split('/')[0]
    setFileType(type)

    // Gera preview para imagens
    if (type === 'image') {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }

  const handleSend = async () => {
    if (!selectedFile) return

    try {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64File = reader.result

        onSendFile({
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          fileType: selectedFile.type,
          fileData: base64File,
          type: fileType
        })

        // Limpa
        handleCancel()
      }
      reader.readAsDataURL(selectedFile)
    } catch (error) {
      console.error('Erro ao enviar arquivo:', error)
      alert('Erro ao enviar arquivo')
    }
  }

  const handleCancel = () => {
    setSelectedFile(null)
    setPreview(null)
    setFileType(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = () => {
    if (fileType === 'image') {
      return (
        <svg viewBox="0 0 24 24" width="40" height="40">
          <path fill="currentColor" d="M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19M8.5,13.5L11,16.5L14.5,12L19,18H5L8.5,13.5Z" />
        </svg>
      )
    }

    if (selectedFile?.type.includes('pdf')) {
      return (
        <svg viewBox="0 0 24 24" width="40" height="40">
          <path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M15.5,16H14V19H12.5V16H11V19H9.5V15A1,1 0 0,1 10.5,14H15.5A1,1 0 0,1 16.5,15V19H15.5V16M10.5,11.5C10.5,12.3 9.8,13 9,13H7.5V15H6V10H9A2,2 0 0,1 11,12M9.5,11.5V12.5H7.5V11.5H9.5M16.5,10C16.5,10.8 15.8,11.5 15,11.5H13.5V15H12V10H15A1.5,1.5 0 0,1 16.5,11.5Z" />
        </svg>
      )
    }

    return (
      <svg viewBox="0 0 24 24" width="40" height="40">
        <path fill="currentColor" d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15,18V16H6V18H15M18,14V12H6V14H18Z" />
      </svg>
    )
  }

  if (selectedFile) {
    return (
      <div className="file-preview-container">
        <div className="file-preview">
          {preview && fileType === 'image' ? (
            <img src={preview} alt="Preview" className="image-preview" />
          ) : (
            <div className="file-icon-preview">
              {getFileIcon()}
              <div className="file-info">
                <span className="file-name">{selectedFile.name}</span>
                <span className="file-size">{formatFileSize(selectedFile.size)}</span>
              </div>
            </div>
          )}
        </div>
        <div className="file-actions">
          <button onClick={handleCancel} className="btn-cancel-file" title="Cancelar">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
            </svg>
          </button>
          <button onClick={handleSend} className="btn-send-file" title="Enviar arquivo">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
            </svg>
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="btn-attach-file"
        title="Anexar arquivo"
      >
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M16.5,6V17.5A4,4 0 0,1 12.5,21.5A4,4 0 0,1 8.5,17.5V5A2.5,2.5 0 0,1 11,2.5A2.5,2.5 0 0,1 13.5,5V15.5A1,1 0 0,1 12.5,16.5A1,1 0 0,1 11.5,15.5V6H10V15.5A2.5,2.5 0 0,0 12.5,18A2.5,2.5 0 0,0 15,15.5V5A4,4 0 0,0 11,1A4,4 0 0,0 7,5V17.5A5.5,5.5 0 0,0 12.5,23A5.5,5.5 0 0,0 18,17.5V6H16.5Z" />
        </svg>
      </button>
    </>
  )
}

export default FileUploader
