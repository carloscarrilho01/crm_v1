import { useState, useCallback, memo } from 'react'
import { useAuth } from '../contexts/AuthContext'
import './MobileNav.css'

function MobileNav({
  currentView,
  onNavigate,
  onNewConversation,
  conversations = [],
  selectedConversation = null,
  onSelectConversation = () => {},
  loading = false
}) {
  const { signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [menuTab, setMenuTab] = useState('conversations') // 'conversations' ou 'navigation'

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(!isMenuOpen)
    // Quando abrir o menu, mostra conversas se estiver no chat, senão mostra navegação
    if (!isMenuOpen) {
      setMenuTab(currentView === 'chat' ? 'conversations' : 'navigation')
    }
  }, [isMenuOpen, currentView])

  const handleNavigate = useCallback((view) => {
    onNavigate(view)
    setIsMenuOpen(false)
  }, [onNavigate])

  const handleSelectConversation = useCallback((conversation) => {
    onSelectConversation(conversation)
    // Se não estiver na view de chat, navega para lá
    if (currentView !== 'chat') {
      onNavigate('chat')
    }
    setIsMenuOpen(false)
  }, [onSelectConversation, currentView, onNavigate])

  const formatTime = useCallback((timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (hours < 24) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    } else if (hours < 48) {
      return 'Ontem'
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    }
  }, [])

  const getInitials = useCallback((name) => {
    if (!name) return '?'
    return name.substring(0, 2).toUpperCase()
  }, [])

  return (
    <>
      {/* Bottom Navigation */}
      <div className="mobile-bottom-nav">
        <button
          className={`nav-button ${currentView === 'chat' ? 'active' : ''}`}
          onClick={() => handleNavigate('chat')}
        >
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M6,9H18V11H6M14,14H6V12H14M18,8H6V6H18" />
          </svg>
          <span>Chat</span>
        </button>

        <button
          className={`nav-button ${currentView === 'crm' ? 'active' : ''}`}
          onClick={() => handleNavigate('crm')}
        >
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z" />
          </svg>
          <span>CRM</span>
        </button>

        <button
          className="nav-button nav-button-center"
          onClick={onNewConversation}
        >
          <div className="center-icon">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </svg>
          </div>
        </button>

        <button
          className={`nav-button ${currentView === 'analytics' ? 'active' : ''}`}
          onClick={() => handleNavigate('analytics')}
        >
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M16,11.78L20.24,4.45L21.97,5.45L16.74,14.5L10.23,10.75L5.46,19H22V21H2V3H4V17.54L9.5,8L16,11.78Z" />
          </svg>
          <span>Analytics</span>
        </button>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div className="menu-overlay" onClick={() => setIsMenuOpen(false)} />
      )}

      {/* Menu Lateral */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <h2>Menu</h2>
          <button className="menu-close" onClick={toggleMenu}>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
            </svg>
          </button>
        </div>

        {/* Tabs de alternância */}
        <div className="menu-tabs">
          <button
            className={`menu-tab ${menuTab === 'conversations' ? 'active' : ''}`}
            onClick={() => setMenuTab('conversations')}
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M6,9H18V11H6M14,14H6V12H14M18,8H6V6H18" />
            </svg>
            <span>Conversas</span>
          </button>
          <button
            className={`menu-tab ${menuTab === 'navigation' ? 'active' : ''}`}
            onClick={() => setMenuTab('navigation')}
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
            </svg>
            <span>Navegação</span>
          </button>
        </div>

        {menuTab === 'conversations' ? (
          /* Lista de Conversas */
          <div className="mobile-conversations">
            {loading ? (
              <div className="loading">Carregando conversas...</div>
            ) : conversations.length === 0 ? (
              <div className="empty-state">
                <p>Nenhuma conversa ainda</p>
                <small>Clique em + para criar uma nova conversa</small>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.userId}
                  className={`conversation-item ${selectedConversation?.userId === conv.userId ? 'active' : ''}`}
                  onClick={() => handleSelectConversation(conv)}
                >
                  <div className="conversation-avatar">
                    {getInitials(conv.userName)}
                  </div>
                  <div className="conversation-info">
                    <div className="conversation-header">
                      <span className="conversation-name">{conv.userName}</span>
                      <span className="conversation-time">
                        {formatTime(conv.lastTimestamp)}
                      </span>
                    </div>
                    <div className="conversation-preview">
                      <span className="last-message">{conv.lastMessage}</span>
                      {conv.unread > 0 && (
                        <span className="unread-badge">{conv.unread}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* Menu de Navegação */
          <nav className="menu-items">
            <button
              className={`menu-item ${currentView === 'chat' ? 'active' : ''}`}
              onClick={() => handleNavigate('chat')}
            >
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M6,9H18V11H6M14,14H6V12H14M18,8H6V6H18" />
              </svg>
              <span>Chat</span>
            </button>

            <button
              className={`menu-item ${currentView === 'crm' ? 'active' : ''}`}
              onClick={() => handleNavigate('crm')}
            >
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z" />
              </svg>
              <span>CRM</span>
            </button>

            <button
              className={`menu-item ${currentView === 'analytics' ? 'active' : ''}`}
              onClick={() => handleNavigate('analytics')}
            >
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M16,11.78L20.24,4.45L21.97,5.45L16.74,14.5L10.23,10.75L5.46,19H22V21H2V3H4V17.54L9.5,8L16,11.78Z" />
              </svg>
              <span>Analytics</span>
            </button>

            <div className="menu-divider"></div>

            <button
              className="menu-item"
              onClick={() => {
                onNewConversation()
                setIsMenuOpen(false)
              }}
            >
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M11,13H9V11H7V9H9V7H11V9H13V11H11V13Z" />
              </svg>
              <span>Nova Conversa</span>
            </button>

            <button
              className="menu-item logout-item"
              onClick={signOut}
            >
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
              </svg>
              <span>Sair</span>
            </button>
          </nav>
        )}

        <div className="menu-footer">
          <div className="menu-user">
            <div className="user-avatar">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
              </svg>
            </div>
            <div className="user-info">
              <span className="user-name">Admin</span>
              <span className="user-status">Online</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(MobileNav)
