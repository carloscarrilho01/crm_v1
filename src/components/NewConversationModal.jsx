import { useState } from 'react';
import './NewConversationModal.css';

// Em produção, usa a mesma URL do site. Em desenvolvimento, usa localhost
const API_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.MODE === 'production'
    ? window.location.origin
    : 'http://localhost:3001'
);

// Templates do WhatsApp Business API
const WHATSAPP_TEMPLATES = [
  {
    id: 'hello_world',
    name: 'Hello World',
    language: 'en_US',
    category: 'Utilidade',
    text: 'Welcome and congratulations!! This message demonstrates your ability to send a WhatsApp message notification from the Cloud API, hosted by Meta. Thank you for taking the time to test with us.',
    hasVariables: false
  }
];

function NewConversationModal({ onClose, onConversationCreated }) {
  const [formData, setFormData] = useState({
    userId: '',
    userName: ''
  });
  const [selectedTemplate, setSelectedTemplate] = useState(WHATSAPP_TEMPLATES[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.userId.trim()) {
      setError('ID do usuário é obrigatório');
      return;
    }

    if (!formData.userName.trim()) {
      setError('Nome do usuário é obrigatório');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/conversations/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: formData.userId.trim(),
          userName: formData.userName.trim(),
          template: {
            name: selectedTemplate.id,
            language: selectedTemplate.language
          }
        })
      });

      if (response.ok) {
        const conversation = await response.json();
        onConversationCreated(conversation);
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erro ao criar conversa');
      }
    } catch (err) {
      console.error('Erro ao criar conversa:', err);
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-conversation-modal-overlay" onClick={onClose}>
      <div className="new-conversation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Nova Conversa</h2>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-content">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-field">
            <label htmlFor="userId">
              ID do Usuário *
              <span className="field-hint">Identificador único do usuário</span>
            </label>
            <input
              type="text"
              id="userId"
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              placeholder="Ex: user_123, tel_5511999999999"
              required
              disabled={loading}
            />
          </div>

          <div className="form-field">
            <label htmlFor="userName">
              Nome do Usuário *
              <span className="field-hint">Nome de exibição</span>
            </label>
            <input
              type="text"
              id="userName"
              value={formData.userName}
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              placeholder="Ex: João Silva"
              required
              disabled={loading}
            />
          </div>

          <div className="form-field">
            <label htmlFor="template">
              Template do WhatsApp *
              <span className="field-hint">Selecione um template aprovado</span>
            </label>
            <div className="template-selector">
              {WHATSAPP_TEMPLATES.map((template) => (
                <div
                  key={template.id}
                  className={`template-option ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
                  onClick={() => !loading && setSelectedTemplate(template)}
                >
                  <div className="template-header">
                    <span className="template-name">{template.name}</span>
                    <span className="template-language">{template.language}</span>
                  </div>
                  <span className="template-category">{template.category}</span>
                  <p className="template-preview">{template.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-create"
              disabled={loading}
            >
              {loading ? 'Criando...' : 'Criar Conversa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewConversationModal;
