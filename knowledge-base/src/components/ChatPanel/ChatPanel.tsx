import { useState, useRef, useEffect } from 'react';
import type { Conversation } from '../../types';
import styles from './ChatPanel.module.css';

interface ChatPanelProps {
  conversation: Conversation | null;
  onSendMessage: (content: string) => void;
  onToggleFavorite: (messageId: string) => void;
}

export default function ChatPanel({
  conversation,
  onSendMessage,
  onToggleFavorite
}: ChatPanelProps) {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const handleSend = () => {
    if (!inputValue.trim() || isTyping) return;

    const message = inputValue.trim();
    setInputValue('');
    onSendMessage(message);
    
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!conversation) {
    return (
      <div className={styles['chat-panel']}>
        <div className={styles['empty-chat']}>
          <div className={styles['empty-icon']}>💬</div>
          <div className={styles['empty-title']}>开始新对话</div>
          <div className={styles['empty-text']}>
            点击左侧「新建对话」按钮，或在输入框中输入问题开始与 AI 对话
          </div>
        </div>
        <div className={styles['chat-input-area']}>
          <div className={styles['input-wrapper']}>
            <textarea
              ref={textareaRef}
              className={styles['chat-input']}
              placeholder="输入您的问题..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button
              className={styles['send-btn']}
              onClick={handleSend}
              disabled={!inputValue.trim()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              发送
            </button>
          </div>
          <div className={styles['input-hint']}>按 Enter 发送，Shift + Enter 换行</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['chat-panel']}>
      <div className={styles['chat-header']}>
        <div className={styles['chat-title']}>{conversation.title}</div>
        <div className={styles['chat-actions']}>
          <button className={styles['action-btn']}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
            更多
          </button>
        </div>
      </div>

      <div className={styles['chat-messages']}>
        {conversation.messages.map((message) => (
          <div
            key={message.id}
            className={`${styles.message} ${styles[`message-${message.role}`]}`}
          >
            <div className={styles['message-avatar']}>
              {message.role === 'user' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              )}
            </div>
            <div>
              <div className={styles['message-content']}>
                {message.content.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < message.content.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </div>
              {message.role === 'assistant' && (
                <div className={styles['message-actions']}>
                  <button
                    className={`${styles['message-action-btn']} ${message.favorite ? styles.favorited : ''}`}
                    onClick={() => onToggleFavorite(message.id)}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill={message.favorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    {message.favorite ? '已收藏' : '收藏'}
                  </button>
                  <button className={styles['message-action-btn']}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    复制
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className={`${styles.message} ${styles['message-assistant']}`}>
            <div className={styles['message-avatar']}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div className={styles['message-content']}>
              <div className={styles['typing-indicator']}>
                <div className={styles['typing-dot']}></div>
                <div className={styles['typing-dot']}></div>
                <div className={styles['typing-dot']}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className={styles['chat-input-area']}>
        <div className={styles['input-wrapper']}>
          <textarea
            ref={textareaRef}
            className={styles['chat-input']}
            placeholder="输入您的问题..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button
            className={styles['send-btn']}
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            发送
          </button>
        </div>
        <div className={styles['input-hint']}>按 Enter 发送，Shift + Enter 换行</div>
      </div>
    </div>
  );
}
