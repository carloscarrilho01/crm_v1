import { useState, useEffect } from 'react'
import './SignatureManager.css'

function SignatureManager({ onClose, onInsertSignature }) {
  const [signature, setSignature] = useState('')

  useEffect(() => {
    // Carrega assinatura salva do localStorage
    const savedSignature = localStorage.getItem('messageSignature')
    if (savedSignature) {
      setSignature(savedSignature)
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem('messageSignature', signature)
    onInsertSignature('\n\n' + signature)
    onClose()
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
          <div className="signature-form-full">
            <div className="signature-form-group">
              <label>Assinatura</label>
              <textarea
                placeholder="Ex: Luiz, consigo te ajudar a resolver essa tela hoje ainda. Prefere entender valores ou agendar diagnóstico gratuito?"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                rows={6}
              />
              <span className="signature-char-count">{signature.length}/257</span>
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
