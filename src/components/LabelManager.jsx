import { useState, useEffect } from 'react'
import './LabelManager.css'

const PRESET_COLORS = [
  '#25D366', // WhatsApp Green
  '#FFB800', // Yellow
  '#FF5722', // Orange
  '#2196F3', // Blue
  '#4CAF50', // Green
  '#E91E63', // Pink
  '#9C27B0', // Purple
  '#00BCD4', // Cyan
  '#795548', // Brown
  '#607D8B', // Gray
]

function LabelManager({ isOpen, onClose, labels, onLabelsChange }) {
  const [localLabels, setLocalLabels] = useState([])
  const [editingLabel, setEditingLabel] = useState(null)
  const [newLabel, setNewLabel] = useState({ name: '', color: '#25D366' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setLocalLabels(labels || [])
  }, [labels])

  const handleCreateLabel = async () => {
    if (!newLabel.name.trim()) {
      setError('Digite um nome para a etiqueta')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/labels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLabel)
      })

      if (!response.ok) throw new Error('Erro ao criar etiqueta')

      const created = await response.json()
      setLocalLabels([...localLabels, created])
      setNewLabel({ name: '', color: '#25D366' })
      onLabelsChange?.()
    } catch (err) {
      setError('Erro ao criar etiqueta')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateLabel = async (label) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/labels/${label.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: label.name, color: label.color })
      })

      if (!response.ok) throw new Error('Erro ao atualizar etiqueta')

      const updated = await response.json()
      setLocalLabels(localLabels.map(l => l.id === updated.id ? updated : l))
      setEditingLabel(null)
      onLabelsChange?.()
    } catch (err) {
      setError('Erro ao atualizar etiqueta')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteLabel = async (labelId) => {
    if (!confirm('Tem certeza que deseja excluir esta etiqueta? Ela será removida de todas as conversas.')) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/labels/${labelId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Erro ao excluir etiqueta')

      setLocalLabels(localLabels.filter(l => l.id !== labelId))
      onLabelsChange?.()
    } catch (err) {
      setError('Erro ao excluir etiqueta')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="label-manager-overlay" onClick={onClose}>
      <div className="label-manager-modal" onClick={e => e.stopPropagation()}>
        <div className="label-manager-header">
          <h2>Gerenciar Etiquetas</h2>
          <button className="close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
            </svg>
          </button>
        </div>

        {error && <div className="label-manager-error">{error}</div>}

        <div className="label-manager-content">
          {/* Criar nova etiqueta */}
          <div className="new-label-form">
            <h3>Nova Etiqueta</h3>
            <div className="form-row">
              <input
                type="text"
                placeholder="Nome da etiqueta"
                value={newLabel.name}
                onChange={e => setNewLabel({ ...newLabel, name: e.target.value })}
                maxLength={30}
              />
              <div className="color-picker">
                {PRESET_COLORS.map(color => (
                  <button
                    key={color}
                    className={`color-option ${newLabel.color === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewLabel({ ...newLabel, color })}
                  />
                ))}
              </div>
              <button
                className="create-btn"
                onClick={handleCreateLabel}
                disabled={loading || !newLabel.name.trim()}
              >
                Criar
              </button>
            </div>
          </div>

          {/* Lista de etiquetas existentes */}
          <div className="labels-list">
            <h3>Etiquetas ({localLabels.length})</h3>
            {localLabels.length === 0 ? (
              <p className="empty-message">Nenhuma etiqueta criada ainda</p>
            ) : (
              localLabels.map(label => (
                <div key={label.id} className="label-item">
                  {editingLabel?.id === label.id ? (
                    <div className="label-edit-form">
                      <input
                        type="text"
                        value={editingLabel.name}
                        onChange={e => setEditingLabel({ ...editingLabel, name: e.target.value })}
                        maxLength={30}
                      />
                      <div className="color-picker compact">
                        {PRESET_COLORS.map(color => (
                          <button
                            key={color}
                            className={`color-option ${editingLabel.color === color ? 'selected' : ''}`}
                            style={{ backgroundColor: color }}
                            onClick={() => setEditingLabel({ ...editingLabel, color })}
                          />
                        ))}
                      </div>
                      <div className="edit-actions">
                        <button
                          className="save-btn"
                          onClick={() => handleUpdateLabel(editingLabel)}
                          disabled={loading}
                        >
                          Salvar
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={() => setEditingLabel(null)}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="label-preview">
                        <span
                          className="label-badge"
                          style={{ backgroundColor: label.color }}
                        >
                          {label.name}
                        </span>
                      </div>
                      <div className="label-actions">
                        <button
                          className="edit-btn"
                          onClick={() => setEditingLabel({ ...label })}
                          title="Editar"
                        >
                          <svg viewBox="0 0 24 24" width="18" height="18">
                            <path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                          </svg>
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteLabel(label.id)}
                          title="Excluir"
                        >
                          <svg viewBox="0 0 24 24" width="18" height="18">
                            <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                          </svg>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LabelManager
