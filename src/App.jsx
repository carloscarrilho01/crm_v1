import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import KanbanBoard from './components/KanbanBoard'
import Analytics from './components/Analytics'
import NewConversationModal from './components/NewConversationModal'
import './App.css'

// Em produção, usa a mesma URL do site. Em desenvolvimento, usa localhost
const API_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.MODE === 'production'
    ? window.location.origin
    : 'http://localhost:3001'
)
const socket = io(API_URL)

// Tornar socket disponível globalmente para os componentes
window.socket = socket

function App() {
  const [currentView, setCurrentView] = useState('chat') // 'chat', 'crm' ou 'analytics'
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showNewConversationModal, setShowNewConversationModal] = useState(false)

  // Carrega conversas iniciais
  useEffect(() => {
    fetchConversations()

    // Escuta mensagens via WebSocket
    socket.on('init', (data) => {
      setConversations(data.sort((a, b) =>
        new Date(b.lastTimestamp) - new Date(a.lastTimestamp)
      ))
      setLoading(false)
    })

    socket.on('message', ({ userId, conversation }) => {
      setConversations(prev => {
        const filtered = prev.filter(c => c.userId !== userId)
        return [conversation, ...filtered]
      })

      // Atualiza conversa selecionada se for a mesma
      if (selectedConversation?.userId === userId) {
        setSelectedConversation(conversation)
      }
    })

    return () => {
      socket.off('init')
      socket.off('message')
    }
  }, [selectedConversation?.userId])

  const fetchConversations = async () => {
    try {
      const response = await fetch(`${API_URL}/api/conversations`)
      const data = await response.json()
      setConversations(data)
      setLoading(false)
    } catch (error) {
      console.error('Erro ao carregar conversas:', error)
      setLoading(false)
    }
  }

  const handleSelectConversation = async (conversation) => {
    try {
      // Carrega apenas as últimas 50 mensagens inicialmente
      const response = await fetch(`${API_URL}/api/conversations/${conversation.userId}?limit=50&offset=0`)
      const data = await response.json()
      setSelectedConversation(data)

      // Atualiza o contador de não lidas
      setConversations(prev =>
        prev.map(c => c.userId === conversation.userId ? { ...c, unread: 0 } : c)
      )
    } catch (error) {
      console.error('Erro ao carregar conversa:', error)
    }
  }

  const handleSendMessage = async (messageData) => {
    if (!selectedConversation) return

    console.log('📤 handleSendMessage chamado com:', messageData)

    // Suporta tanto string quanto objeto { type, content, duration, fileName, etc }
    const payload = typeof messageData === 'string'
      ? { message: messageData, type: 'text' }
      : {
          message: messageData.content,
          type: messageData.type || 'text',
          duration: messageData.duration,
          fileName: messageData.fileName,
          fileSize: messageData.fileSize,
          fileType: messageData.fileType,
          fileCategory: messageData.fileCategory
        }

    console.log('📦 Payload montado:', payload)

    // Valida apenas mensagens de texto vazias
    if (payload.type === 'text' && (!payload.message || !payload.message.trim())) {
      console.log('⚠️ Mensagem de texto vazia, ignorando')
      return
    }

    // Para arquivos e áudios, só precisa ter conteúdo
    if (!payload.message) {
      console.log('⚠️ Payload sem mensagem, ignorando')
      return
    }

    try {
      console.log('🚀 Enviando para:', `${API_URL}/api/conversations/${selectedConversation.userId}/send`)
      const response = await fetch(`${API_URL}/api/conversations/${selectedConversation.userId}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()
      console.log('✅ Resposta do servidor:', result)
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error)
    }
  }

  const handleNewConversation = () => {
    setShowNewConversationModal(true)
  }

  const handleConversationCreated = (newConversation) => {
    // Adiciona a nova conversa na lista
    setConversations(prev => [newConversation, ...prev])

    // Seleciona automaticamente a nova conversa
    setSelectedConversation(newConversation)
  }

  const handleLoadMoreMessages = async () => {
    if (!selectedConversation || !selectedConversation.hasMore) return

    try {
      const currentMessageCount = selectedConversation.messages.length
      const response = await fetch(
        `${API_URL}/api/conversations/${selectedConversation.userId}?limit=50&offset=${currentMessageCount}`
      )
      const data = await response.json()

      // Adiciona as mensagens mais antigas ao início do array
      setSelectedConversation(prev => ({
        ...prev,
        messages: [...data.messages, ...prev.messages],
        hasMore: data.hasMore,
        totalMessages: data.totalMessages
      }))

      return data.messages.length
    } catch (error) {
      console.error('Erro ao carregar mais mensagens:', error)
      return 0
    }
  }

  return (
    <div className="app">
      {currentView === 'chat' ? (
        <>
          <Sidebar
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelectConversation={handleSelectConversation}
            onNewConversation={handleNewConversation}
            onNavigateToCRM={() => setCurrentView('crm')}
            onNavigateToAnalytics={() => setCurrentView('analytics')}
            loading={loading}
          />
          <ChatWindow
            conversation={selectedConversation}
            onSendMessage={handleSendMessage}
            onLoadMoreMessages={handleLoadMoreMessages}
            socket={socket}
          />
        </>
      ) : currentView === 'crm' ? (
        <div className="crm-view">
          <div className="crm-nav">
            <button className="back-button" onClick={() => setCurrentView('chat')}>
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
              </svg>
              Voltar para Chat
            </button>
            <button className="nav-button" onClick={() => setCurrentView('analytics')}>
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M16,11.78L20.24,4.45L21.97,5.45L16.74,14.5L10.23,10.75L5.46,19H22V21H2V3H4V17.54L9.5,8L16,11.78Z" />
              </svg>
              Analytics
            </button>
          </div>
          <KanbanBoard socket={socket} />
        </div>
      ) : (
        <div className="analytics-view">
          <div className="analytics-nav">
            <button className="back-button" onClick={() => setCurrentView('chat')}>
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
              </svg>
              Voltar para Chat
            </button>
            <button className="nav-button" onClick={() => setCurrentView('crm')}>
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z" />
              </svg>
              CRM
            </button>
          </div>
          <Analytics socket={socket} />
        </div>
      )}

      {showNewConversationModal && (
        <NewConversationModal
          onClose={() => setShowNewConversationModal(false)}
          onConversationCreated={handleConversationCreated}
        />
      )}
    </div>
  )
}

export default App
