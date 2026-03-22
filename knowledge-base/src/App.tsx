import { useState, useCallback } from 'react';
import ChatSidebar from './components/ChatSidebar/ChatSidebar';
import KnowledgeTree from './components/KnowledgeTree/KnowledgeTree';
import DocumentViewer from './components/DocumentViewer/DocumentViewer';
import ChatPanel from './components/ChatPanel/ChatPanel';
import KnowledgeManager from './components/KnowledgeManager/KnowledgeManager';
import type { Conversation, Message, TreeNode } from './types';
import { mockKnowledgeBase, mockConversations, generateKnowledgeBasedResponse } from './data/mockData';
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

  const handleSendMessage = useCallback((content: string) => {
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
        content: generateKnowledgeBasedResponse(content, knowledgeBase),
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
          content: generateKnowledgeBasedResponse(content, knowledgeBase),
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
  }, [currentConversationId, setConversations, knowledgeBase]);

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
          />
        )}
      </div>
    </div>
  );
}

export default App;
