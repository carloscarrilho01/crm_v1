import { memo } from 'react'
import './SkeletonLoader.css'

// Skeleton para item de conversa na sidebar
export const ConversationSkeleton = memo(function ConversationSkeleton() {
  return (
    <div className="conversation-skeleton">
      <div className="skeleton-avatar skeleton-pulse" />
      <div className="skeleton-content">
        <div className="skeleton-header">
          <div className="skeleton-name skeleton-pulse" />
          <div className="skeleton-time skeleton-pulse" />
        </div>
        <div className="skeleton-message skeleton-pulse" />
      </div>
    </div>
  )
})

// Lista de skeletons de conversa
export const ConversationListSkeleton = memo(function ConversationListSkeleton({ count = 8 }) {
  return (
    <div className="conversation-list-skeleton">
      {Array.from({ length: count }).map((_, index) => (
        <ConversationSkeleton key={index} />
      ))}
    </div>
  )
})

// Skeleton para mensagem
export const MessageSkeleton = memo(function MessageSkeleton({ isOutgoing = false }) {
  return (
    <div className={`message-skeleton ${isOutgoing ? 'outgoing' : 'incoming'}`}>
      <div className="skeleton-bubble skeleton-pulse">
        <div className="skeleton-text-line skeleton-pulse" style={{ width: '80%' }} />
        <div className="skeleton-text-line skeleton-pulse" style={{ width: '60%' }} />
        <div className="skeleton-text-line skeleton-pulse" style={{ width: '40%' }} />
      </div>
    </div>
  )
})

// Lista de skeletons de mensagens
export const MessageListSkeleton = memo(function MessageListSkeleton({ count = 6 }) {
  return (
    <div className="message-list-skeleton">
      {Array.from({ length: count }).map((_, index) => (
        <MessageSkeleton key={index} isOutgoing={index % 3 === 0} />
      ))}
    </div>
  )
})

// Loading spinner centralizado
export const LoadingSpinner = memo(function LoadingSpinner({ size = 'medium', text = '' }) {
  return (
    <div className={`loading-spinner-container ${size}`}>
      <div className="loading-spinner">
        <div className="spinner-ring" />
        <div className="spinner-ring" />
        <div className="spinner-ring" />
      </div>
      {text && <span className="loading-text">{text}</span>}
    </div>
  )
})

// Loading overlay para transições
export const LoadingOverlay = memo(function LoadingOverlay({ text = 'Carregando...' }) {
  return (
    <div className="loading-overlay">
      <LoadingSpinner size="large" text={text} />
    </div>
  )
})

// Skeleton para o chat header
export const ChatHeaderSkeleton = memo(function ChatHeaderSkeleton() {
  return (
    <div className="chat-header-skeleton">
      <div className="skeleton-avatar skeleton-pulse" />
      <div className="skeleton-info">
        <div className="skeleton-name skeleton-pulse" />
        <div className="skeleton-status skeleton-pulse" />
      </div>
    </div>
  )
})

export default {
  ConversationSkeleton,
  ConversationListSkeleton,
  MessageSkeleton,
  MessageListSkeleton,
  LoadingSpinner,
  LoadingOverlay,
  ChatHeaderSkeleton
}
