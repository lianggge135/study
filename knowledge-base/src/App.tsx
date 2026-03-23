import { useState, useCallback, useEffect } from 'react';
import ChatSidebar from './components/ChatSidebar/ChatSidebar';
import KnowledgeTree from './components/KnowledgeTree/KnowledgeTree';
import DocumentViewer from './components/DocumentViewer/DocumentViewer';
import ChatPanel from './components/ChatPanel/ChatPanel';
import KnowledgeManager from './components/KnowledgeManager/KnowledgeManager';
import type { Conversation, Message, TreeNode } from './types';
import { mockKnowledgeBase, mockConversations, generateKnowledgeBasedResponse, initEmbeddingModel } from './data/mockData';
import { useLocalStorage } from './hooks/useLocalStorage';
import styles from './App.module.css';

type ViewMode = 'document' | 'chat' | 'manage';

function findDocumentById(nodes: TreeNode[], id: string): TreeNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findDocumentById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function App() {
  const [conversations, setConversations] = useLocalStorage<Conversation[]>('kb_conversations', mockConversations);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [knowledgeBase, setKnowledgeBase] = useLocalStorage<TreeNode[]>('kb_knowledge_base', mockKnowledgeBase);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['1', '2', '2-1', '3']));
  const [viewMode, setViewMode] = useState<ViewMode>('document');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);

  // Initialize embedding model on mount
  useEffect(() => {
    initEmbeddingModel().then(() => {
      setIsModelReady(true);
    }).catch(err => {
      console.error('Failed to load embedding model:', err);
    });
  }, []);

  const currentConversation = conversations.find(c => c.id === currentConversationId) || null;

  const selectedDocument = selectedDocumentId
    ? findDocumentById(knowledgeBase, selectedDocumentId)?.content || null
    : null;

  const handleNewConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: generateId(),
      title: '新对话',
      createdAt: new Date(),
      messages: []
    };
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
    setViewMode('chat');
  }, [setConversations]);

  const handleSelectConversation = useCallback((id: string) => {
    setCurrentConversationId(id);
    setViewMode('chat');
  }, []);

  const handleDeleteConversation = useCallback((id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentConversationId === id) {
      setCurrentConversationId(null);
    }
  }, [currentConversationId, setConversations]);

  const handleSendMessage = useCallback(async (content: string) => {
    if (isAiLoading) return;

    setIsAiLoading(true);

    try {
      // Generate AI response (async with semantic search)
      const aiResponseContent = await generateKnowledgeBasedResponse(content, knowledgeBase);

      if (!currentConversationId) {
        const newConversation: Conversation = {
          id: generateId(),
          title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
          createdAt: new Date(),
          messages: []
        };

        const userMessage: Message = {
          id: generateId(),
          role: 'user',
          content,
          createdAt: new Date()
        };

        const aiResponse: Message = {
          id: generateId(),
          role: 'assistant',
          content: aiResponseContent,
          createdAt: new Date()
        };

        newConversation.messages = [userMessage, aiResponse];
        setConversations(prev => [newConversation, ...prev]);
        setCurrentConversationId(newConversation.id);
      } else {
        setConversations(prev => prev.map(conv => {
          if (conv.id !== currentConversationId) return conv;

          const userMessage: Message = {
            id: generateId(),
            role: 'user',
            content,
            createdAt: new Date()
          };

          const aiResponse: Message = {
            id: generateId(),
            role: 'assistant',
            content: aiResponseContent,
            createdAt: new Date()
          };

          return {
            ...conv,
            messages: [...conv.messages, userMessage, aiResponse],
            title: conv.messages.length === 0
              ? content.slice(0, 30) + (content.length > 30 ? '...' : '')
              : conv.title
          };
        }));
      }
    } catch (error) {
      console.error('Error generating response:', error);
      // Add error message as AI response
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: '抱歉，生成回答时出现了错误，请稍后重试。',
        createdAt: new Date()
      };

      if (currentConversationId) {
        setConversations(prev => prev.map(conv => {
          if (conv.id !== currentConversationId) return conv;
          return {
            ...conv,
            messages: [...conv.messages, errorMessage]
          };
        }));
      }
    } finally {
      setIsAiLoading(false);
    }
  }, [currentConversationId, setConversations, knowledgeBase, isAiLoading]);

  const handleToggleFavorite = useCallback((messageId: string) => {
    setConversations(prev => prev.map(conv => ({
      ...conv,
      messages: conv.messages.map(msg =>
        msg.id === messageId
          ? { ...msg, favorite: !msg.favorite }
          : msg
      )
    })));
  }, [setConversations]);

  const handleSelectDocument = useCallback((id: string) => {
    setSelectedDocumentId(id);
    setViewMode('document');
  }, []);

  const handleToggleFolder = useCallback((id: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleOpenFavorites = useCallback(() => {
    setViewMode('chat');
  }, []);

  const handleOpenManager = useCallback(() => {
    setViewMode('manage');
  }, []);

  const handleBackFromManager = useCallback(() => {
    setViewMode('document');
  }, []);

  const handleKnowledgeBaseChange = useCallback((newData: TreeNode[]) => {
    setKnowledgeBase(newData);
  }, [setKnowledgeBase]);

  if (viewMode === 'manage') {
    return (
      <div className={styles.app}>
        <KnowledgeManager
          data={knowledgeBase}
          onChange={handleKnowledgeBaseChange}
          onBack={handleBackFromManager}
        />
      </div>
    );
  }

  return (
    <div className={styles.app}>
      {!isModelReady && (
        <div className={styles['model-loading-overlay']}>
          <div className={styles['model-loading-content']}>
            <div className={styles['model-loading-spinner']}></div>
            <div className={styles['model-loading-text']}>正在加载语义搜索模型...</div>
            <div className={styles['model-loading-subtext']}>首次加载需要下载模型文件，约 1-2 分钟</div>
          </div>
        </div>
      )}

      <ChatSidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        onOpenFavorites={handleOpenFavorites}
        onOpenManager={handleOpenManager}
      />

      <KnowledgeTree
        data={knowledgeBase}
        selectedDocumentId={selectedDocumentId}
        expandedFolders={expandedFolders}
        onSelectDocument={handleSelectDocument}
        onToggleFolder={handleToggleFolder}
      />

      <div className={styles['main-content']}>
        {viewMode === 'document' ? (
          <DocumentViewer document={selectedDocument} />
        ) : (
          <ChatPanel
            conversation={currentConversation}
            onSendMessage={handleSendMessage}
            onToggleFavorite={handleToggleFavorite}
            isAiLoading={isAiLoading}
          />
        )}
      </div>
    </div>
  );
}

export default App;
