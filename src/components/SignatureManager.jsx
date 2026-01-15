import { useState, useEffect } from 'react'
import './SignatureManager.css'

function SignatureManager({ onClose, onInsertSignature }) {
  const [signature, setSignature] = useState({
    nome: '',
    cargo: '',
    empresa: '',
    telefone: '',
    email: '',
    site: ''
  })

  useEffect(() => {
    // Carrega assinatura salva do localStorage
    const savedSignature = localStorage.getItem('messageSignature')
    if (savedSignature) {
      setSignature(JSON.parse(savedSignature))
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem('messageSignature', JSON.stringify(signature))
    const signatureText = generateSignatureText()
    onInsertSignature(signatureText)
    onClose()
  }

  const generateSignatureText = () => {
    let text = '\n\n'
    if (signature.nome) text += `*${signature.nome}*\n`
    if (signature.cargo) text += `${signature.cargo}\n`
    if (signature.empresa) text += `${signature.empresa}\n`
    if (signature.telefone) text += `📱 ${signature.telefone}\n`
    if (signature.email) text += `📧 ${signature.email}\n`
    if (signature.site) text += `🌐 ${signature.site}`
    return text
  }

  const handlePreview = () => {
    return generateSignatureText()
  }

  return (
    <div className="signature-modal-overlay" onClick={onClose}>
      <div className="signature-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="signature-modal-header">
          <h2>Configurar Assinatura</h2>
          <button className="signature-close-button" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
            </svg>
          </button>
        </div>

        <div className="signature-modal-body">
          <div className="signature-form">
            <div className="signature-form-group">
              <label>Nome</label>
              <input
                type="text"
                placeholder="Seu nome"
                value={signature.nome}
                onChange={(e) => setSignature({ ...signature, nome: e.target.value })}
              />
            </div>

            <div className="signature-form-group">
              <label>Cargo</label>
              <input
                type="text"
                placeholder="Ex: Gerente de Vendas"
                value={signature.cargo}
                onChange={(e) => setSignature({ ...signature, cargo: e.target.value })}
              />
            </div>

            <div className="signature-form-group">
              <label>Empresa</label>
              <input
                type="text"
                placeholder="Nome da empresa"
                value={signature.empresa}
                onChange={(e) => setSignature({ ...signature, empresa: e.target.value })}
              />
            </div>

            <div className="signature-form-group">
              <label>Telefone</label>
              <input
                type="text"
                placeholder="(00) 00000-0000"
                value={signature.telefone}
                onChange={(e) => setSignature({ ...signature, telefone: e.target.value })}
              />
            </div>

            <div className="signature-form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={signature.email}
                onChange={(e) => setSignature({ ...signature, email: e.target.value })}
              />
            </div>

            <div className="signature-form-group">
              <label>Site</label>
              <input
                type="text"
                placeholder="www.seusite.com"
                value={signature.site}
                onChange={(e) => setSignature({ ...signature, site: e.target.value })}
              />
            </div>
          </div>

          <div className="signature-preview">
            <h3>Pré-visualização</h3>
            <div className="signature-preview-content">
              {handlePreview()}
            </div>
          </div>
        </div>

        <div className="signature-modal-footer">
          <button className="signature-btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button className="signature-btn-save" onClick={handleSave}>
            Inserir Assinatura
          </button>
        </div>
      </div>
    </div>
  )
}

export default SignatureManager
