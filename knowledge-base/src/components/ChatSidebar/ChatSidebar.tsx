import type { Conversation } from '../../types';
import styles from './ChatSidebar.module.css';

interface ChatSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onOpenFavorites: () => void;
  onOpenManager: () => void;
}

const groupConversationsByDate = (conversations: Conversation[]) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const lastWeek = new Date(today.getTime() - 7 * 86400000);

  const groups: { [key: string]: Conversation[] } = {
    '今天': [],
    '昨天': [],
    '最近7天': [],
    '更早': []
  };

  conversations.forEach(conv => {
    const convDate = new Date(conv.createdAt);
    if (convDate >= today) {
      groups['今天'].push(conv);
    } else if (convDate >= yesterday) {
      groups['昨天'].push(conv);
    } else if (convDate >= lastWeek) {
      groups['最近7天'].push(conv);
    } else {
      groups['更早'].push(conv);
    }
  });

  return groups;
};

export default function ChatSidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onOpenFavorites,
  onOpenManager
}: ChatSidebarProps) {
  const groupedConversations = groupConversationsByDate(conversations);

  return (
    <div className={styles['chat-sidebar']}>
      <div className={styles['sidebar-header']}>
        <div className={styles.logo}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          知识库问答
        </div>
        <button className={styles['new-chat-btn']} onClick={onNewConversation}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          新建对话
        </button>
      </div>

      <div className={styles['conversation-list']}>
        {conversations.length === 0 ? (
          <div className={styles['empty-state']}>
            <div className={styles['empty-icon']}>💬</div>
            <div className={styles['empty-text']}>暂无对话记录<br />点击上方按钮开始新对话</div>
          </div>
        ) : (
          Object.entries(groupedConversations).map(([group, convs]) => (
            convs.length > 0 && (
              <div key={group} className={styles['conversation-group']}>
                <div className={styles['group-title']}>{group}</div>
                {convs.map(conv => (
                  <div
                    key={conv.id}
                    className={`${styles['conversation-item']} ${currentConversationId === conv.id ? styles.active : ''}`}
                    onClick={() => onSelectConversation(conv.id)}
                  >
                    <span className={styles['conversation-icon']}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </span>
                    <span className={styles['conversation-title']}>{conv.title}</span>
                    <button
                      className={styles['conversation-delete']}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conv.id);
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )
          ))
        )}
      </div>

      <div className={styles['sidebar-footer']}>
        <div className={styles['footer-item']} onClick={onOpenManager}>
          <span className={styles['footer-icon']}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </span>
          知识库管理
        </div>
        <div className={styles['footer-item']} onClick={onOpenFavorites}>
          <span className={styles['footer-icon']}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </span>
          我的收藏
        </div>
      </div>
    </div>
  );
}
