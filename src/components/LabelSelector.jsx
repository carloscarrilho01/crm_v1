import { useState, useRef, useEffect } from 'react'
import './LabelSelector.css'

function LabelSelector({ labels, currentLabelId, onSelect, onManageLabels }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const currentLabel = labels.find(l => l.id === currentLabelId)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (labelId) => {
    onSelect(labelId)
    setIsOpen(false)
  }

  return (
    <div className="label-selector" ref={dropdownRef}>
      <button
        className="label-selector-trigger"
        onClick={() => setIsOpen(!isOpen)}
        title="Etiqueta"
      >
        {currentLabel ? (
          <span
            className="current-label"
            style={{ backgroundColor: currentLabel.color }}
          >
            {currentLabel.name}
          </span>
        ) : (
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M5.5,7A1.5,1.5 0 0,1 4,5.5A1.5,1.5 0 0,1 5.5,4A1.5,1.5 0 0,1 7,5.5A1.5,1.5 0 0,1 5.5,7M21.41,11.58L12.41,2.58C12.05,2.22 11.55,2 11,2H4C2.89,2 2,2.89 2,4V11C2,11.55 2.22,12.05 2.59,12.41L11.58,21.41C11.95,21.77 12.45,22 13,22C13.55,22 14.05,21.77 14.41,21.41L21.41,14.41C21.78,14.05 22,13.55 22,13C22,12.44 21.77,11.94 21.41,11.58Z" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="label-selector-dropdown">
          <div className="dropdown-header">Etiquetas</div>

          {currentLabelId && (
            <button
              className="label-option remove-label"
              onClick={() => handleSelect(null)}
            >
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
              </svg>
              Remover etiqueta
            </button>
          )}

          {labels.length === 0 ? (
            <div className="no-labels">
              Nenhuma etiqueta criada
            </div>
          ) : (
            labels.map(label => (
              <button
                key={label.id}
                className={`label-option ${label.id === currentLabelId ? 'selected' : ''}`}
                onClick={() => handleSelect(label.id)}
              >
                <span
                  className="label-color"
                  style={{ backgroundColor: label.color }}
                />
                <span className="label-name">{label.name}</span>
                {label.id === currentLabelId && (
                  <svg viewBox="0 0 24 24" width="16" height="16" className="check-icon">
                    <path fill="currentColor" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                  </svg>
                )}
              </button>
            ))
          )}

          <div className="dropdown-divider" />

          <button
            className="label-option manage-labels"
            onClick={() => {
              setIsOpen(false)
              onManageLabels?.()
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </svg>
            Gerenciar etiquetas
          </button>
        </div>
      )}
    </div>
  )
}

export default LabelSelector
