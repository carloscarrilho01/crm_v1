import { useState, useEffect } from 'react'
import './SignatureManager.css'

function SignatureManager({ onClose }) {
  const [agentName, setAgentName] = useState('')

  useEffect(() => {
    // Carrega nome do agente salvo do localStorage
    const savedName = localStorage.getItem('agentName')
    if (savedName) {
      setAgentName(savedName)
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem('agentName', agentName)
    onClose()
  }

  return (
    <div className="signature-modal-overlay" onClick={onClose}>
      <div className="signature-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="signature-modal-header">
          <h2>Nome do Atendente</h2>
          <button className="signature-close-button" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
            </svg>
          </button>
        </div>

        <div className="signature-modal-body">
          <div className="signature-form-full">
            <div className="signature-form-group">
              <label>Nome que aparecerá nas mensagens</label>
              <input
                type="text"
                placeholder="Ex: Lucas - Atendimento Dr.Mac"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                maxLength={50}
              />
              <span className="signature-char-count">{agentName.length}/50</span>
            </div>
          </div>
        </div>

        <div className="signature-modal-footer">
          <button className="signature-btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button className="signature-btn-save" onClick={handleSave}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}

export default SignatureManager
