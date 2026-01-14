import { useState } from 'react';
import './NewConversationModal.css';

// Em produção, usa a mesma URL do site. Em desenvolvimento, usa localhost
const API_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.MODE === 'production'
    ? window.location.origin
    : 'http://localhost:3001'
);

function NewConversationModal({ onClose, onConversationCreated }) {
  const [formData, setFormData] = useState({
    userId: '',
    userName: '',
    initialMessage: ''
  });
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
          initialMessage: formData.initialMessage.trim() || 'Olá! Como posso ajudar?'
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
            <label htmlFor="initialMessage">
              Mensagem Inicial (opcional)
              <span className="field-hint">Primeira mensagem enviada ao usuário</span>
            </label>
            <textarea
              id="initialMessage"
              value={formData.initialMessage}
              onChange={(e) => setFormData({ ...formData, initialMessage: e.target.value })}
              placeholder="Ex: Olá! Como posso ajudar você hoje?"
              rows="3"
              disabled={loading}
            />
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
