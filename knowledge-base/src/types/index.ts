export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
  favorite?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
  messages: Message[];
}

export interface TreeNode {
  id: string;
  name: string;
  type: 'folder' | 'document';
  children?: TreeNode[];
  content?: DocumentContent;
}

export interface DocumentContent {
  title: string;
  content: string;
  breadcrumb: string[];
  source?: string;
}

export interface AppState {
  conversations: Conversation[];
  currentConversationId: string | null;
  knowledgeBase: TreeNode[];
  selectedDocumentId: string | null;
  expandedFolders: Set<string>;
  favorites: string[];
}
