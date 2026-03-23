import type { TreeNode, Conversation } from '../types';
import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js to use local cache
env.cacheDir = './models';

export const mockKnowledgeBase: TreeNode[] = [
  {
    id: '1',
    name: '产品文档',
    type: 'folder',
    children: [
      {
        id: '1-1',
        name: '快速开始',
        type: 'document',
        content: {
          title: '快速开始指南',
          content: `## 欢迎使用知识库问答系统

本系统是一个基于知识库的智能问答平台，支持文档浏览、对话式问答、收藏管理等功能。

### 主要功能

1. **知识库浏览** - 通过左侧目录树浏览所有文档
2. **智能问答** - 基于知识库内容进行对话式问答
3. **收藏管理** - 收藏重要的问答记录，方便后续查阅

### 如何开始

1. 点击左侧「新建对话」按钮开始新的问答
2. 在中间目录树中选择感兴趣的文档
3. 在输入框中输入您的问题，按 Enter 发送

### 快捷键

- \`Ctrl + N\` - 新建对话
- \`Ctrl + F\` - 搜索文档
- \`Esc\` - 清空输入框`,
          breadcrumb: ['产品文档', '快速开始'],
          source: '官方文档'
        }
      },
      {
        id: '1-2',
        name: '功能介绍',
        type: 'document',
        content: {
          title: '功能介绍',
          content: `## 系统功能详解

### 1. 对话功能

系统支持多轮对话，能够理解上下文语境，提供连贯的回答。

**特点：**
- 支持自然语言输入
- 自动保存对话历史
- 支持对话收藏

### 2. 知识库管理

知识库采用树形结构组织，支持多层级目录。

**特点：**
- 文件夹展开/收起
- 文档快速定位
- 面包屑导航

### 3. 文档查看

右侧主内容区展示选中文档的详细内容。

**特点：**
- 支持 Markdown 渲染
- 面包屑导航
- 来源标注`,
          breadcrumb: ['产品文档', '功能介绍'],
          source: '官方文档'
        }
      }
    ]
  },
  {
    id: '2',
    name: '技术文档',
    type: 'folder',
    children: [
      {
        id: '2-1',
        name: 'API 接口',
        type: 'folder',
        children: [
          {
            id: '2-1-1',
            name: '对话接口',
            type: 'document',
            content: {
              title: '对话接口文档',
              content: `## 对话 API

### 发送消息

\`\`\`
POST /api/chat/send
\`\`\`

**请求参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| conversationId | string | 否 | 对话ID，不传则创建新对话 |
| message | string | 是 | 用户消息内容 |

**响应示例：**

\`\`\`json
{
  "code": 200,
  "data": {
    "conversationId": "conv_123",
    "reply": "这是AI的回复内容"
  }
}
\`\`\``,
              breadcrumb: ['技术文档', 'API 接口', '对话接口'],
              source: '技术文档'
            }
          },
          {
            id: '2-1-2',
            name: '知识库接口',
            type: 'document',
            content: {
              title: '知识库接口文档',
              content: `## 知识库 API

### 获取目录树

\`\`\`
GET /api/knowledge/tree
\`\`\`

**响应示例：**

\`\`\`json
{
  "code": 200,
  "data": [
    {
      "id": "1",
      "name": "产品文档",
      "type": "folder",
      "children": [...]
    }
  ]
}
\`\`\`

### 获取文档内容

\`\`\`
GET /api/knowledge/document/:id
\`\`\``,
              breadcrumb: ['技术文档', 'API 接口', '知识库接口'],
              source: '技术文档'
            }
          }
        ]
      },
      {
        id: '2-2',
        name: '架构设计',
        type: 'document',
        content: {
          title: '系统架构设计',
          content: `## 系统架构

### 整体架构

系统采用前后端分离架构：

\`\`\`
┌─────────────────────────────────────┐
│           Frontend (React)          │
├─────────────────────────────────────┤
│           API Gateway               │
├─────────────────────────────────────┤
│  Chat Service │ Knowledge Service   │
├─────────────────────────────────────┤
│           Database                  │
└─────────────────────────────────────┘
\`\`\`

### 技术栈

**前端：**
- React 18
- TypeScript
- CSS Modules

**后端：**
- Node.js
- Express
- MongoDB`,
          breadcrumb: ['技术文档', '架构设计'],
          source: '技术文档'
        }
      }
    ]
  },
  {
    id: '3',
    name: '常见问题',
    type: 'folder',
    children: [
      {
        id: '3-1',
        name: '使用问题',
        type: 'document',
        content: {
          title: '常见使用问题',
          content: `## 常见问题解答

### Q: 如何新建对话？

A: 点击左侧边栏顶部的「新建对话」按钮即可创建新的对话会话。

### Q: 如何收藏问答？

A: 在对话消息中点击收藏图标，即可将当前问答添加到收藏列表。

### Q: 如何查看历史对话？

A: 左侧边栏会显示所有历史对话记录，点击即可查看。

### Q: 知识库目录可以搜索吗？

A: 可以，在目录栏顶部有搜索框，输入关键词即可搜索相关文档。`,
          breadcrumb: ['常见问题', '使用问题'],
          source: 'FAQ'
        }
      }
    ]
  }
];

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    title: '如何使用知识库问答系统？',
    createdAt: new Date(Date.now() - 3600000),
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: '如何使用知识库问答系统？',
        createdAt: new Date(Date.now() - 3600000)
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: '知识库问答系统使用非常简单：\n\n1. **浏览文档**：在中间目录树中选择感兴趣的文档\n2. **开始对话**：点击左侧「新建对话」按钮\n3. **提问**：在输入框中输入问题并发送\n\n系统会基于知识库内容为您提供准确的回答。',
        createdAt: new Date(Date.now() - 3500000)
      }
    ]
  },
  {
    id: 'conv-2',
    title: 'API 接口如何调用？',
    createdAt: new Date(Date.now() - 86400000),
    messages: [
      {
        id: 'msg-3',
        role: 'user',
        content: 'API 接口如何调用？',
        createdAt: new Date(Date.now() - 86400000)
      },
      {
        id: 'msg-4',
        role: 'assistant',
        content: '调用 API 接口需要以下步骤：\n\n1. 获取 API Key\n2. 构建请求参数\n3. 发送 HTTP 请求\n\n详细接口文档请查看「技术文档 > API 接口」目录下的相关文档。',
        createdAt: new Date(Date.now() - 86300000),
        favorite: true
      }
    ]
  }
];

// ============== Semantic Search Implementation ==============

interface SearchResult {
  id: string;
  title: string;
  content: string;
  breadcrumb: string[];
  relevance: number;
}

// Embedding model - using Xenia (multilingual model, good for Chinese)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let embedder: any = null;
let embeddingCache: Map<string, number[]> = new Map();
let docEmbeddings: Map<string, number[]> = new Map();

// Cosine similarity
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

// Extract all documents from knowledge base
function extractAllDocuments(nodes: TreeNode[]): SearchResult[] {
  const results: SearchResult[] = [];

  function traverse(node: TreeNode) {
    if (node.type === 'document' && node.content) {
      results.push({
        id: node.id,
        title: node.content.title,
        content: node.content.content,
        breadcrumb: node.content.breadcrumb,
        relevance: 0
      });
    }
    if (node.children) {
      node.children.forEach(traverse);
    }
  }

  nodes.forEach(traverse);
  return results;
}

// Generate embedding for text
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getEmbedding(text: string, embedderInstance: any): Promise<number[]> {
  // Check cache first
  const cacheKey = text.slice(0, 100);
  if (embeddingCache.has(cacheKey)) {
    return embeddingCache.get(cacheKey)!;
  }

  const embedding = await embedderInstance(text, {
    pooling: 'mean',
    normalize: true
  }) as unknown as number[];

  embeddingCache.set(cacheKey, embedding);
  return embedding;
}

// Initialize the embedding model
let modelLoadingPromise: Promise<void> | null = null;

export async function initEmbeddingModel(): Promise<void> {
  if (embedder) return;

  if (modelLoadingPromise) {
    return modelLoadingPromise;
  }

  modelLoadingPromise = (async () => {
    console.log('🔄 正在加载语义嵌入模型 (首次加载约需1-2分钟)...');

    // Using a multilingual model that supports Chinese well
    embedder = await pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2',  // Smaller, faster model
      {
        device: 'cpu',  // Explicitly use CPU
      }
    );

    console.log('✅ 语义嵌入模型加载完成');

    // Pre-compute document embeddings
    const docs = extractAllDocuments(mockKnowledgeBase);
    console.log(`📚 正在预计算 ${docs.length} 篇文档的嵌入向量...`);

    for (const doc of docs) {
      const combinedText = `${doc.title} ${doc.content}`;
      const embedding = await getEmbedding(combinedText, embedder);
      docEmbeddings.set(doc.id, embedding);
    }

    console.log('✅ 文档嵌入预计算完成');
  })();

  return modelLoadingPromise;
}

// Check if model is ready
export function isEmbeddingModelReady(): boolean {
  return embedder !== null;
}

// Find relevant content using semantic similarity
export async function findRelevantDocuments(
  question: string,
  knowledgeBase: TreeNode[]
): Promise<SearchResult[]> {
  if (!embedder) {
    console.warn('Embedding model not initialized');
    return [];
  }

  const docs = extractAllDocuments(knowledgeBase);

  // Get question embedding
  const questionEmbedding = await getEmbedding(question, embedder);

  // Calculate similarities
  for (const doc of docs) {
    const docEmbedding = docEmbeddings.get(doc.id);
    if (docEmbedding) {
      doc.relevance = cosineSimilarity(questionEmbedding, docEmbedding);
    }
  }

  // Sort by relevance
  docs.sort((a, b) => b.relevance - a.relevance);

  return docs;
}

// Extract relevant content from document based on question
function extractRelevantContent(_question: string, content: string, maxLength: number = 600): string {
  // Simple content chunking - split by paragraphs and return most relevant ones
  const lines = content.split('\n').filter(line => line.trim());

  // If content is short enough, return it all
  if (content.length <= maxLength) {
    return content;
  }

  // Otherwise, return first part with key sections
  let result = '';
  for (const line of lines) {
    if (result.length + line.length > maxLength) {
      break;
    }
    if (line.startsWith('##') || line.startsWith('###') || line.startsWith('**') || line.startsWith('- ')) {
      result += line + '\n';
    }
  }

  // Fallback to beginning of content
  if (!result) {
    result = content.slice(0, maxLength) + (content.length > maxLength ? '...' : '');
  }

  return result || content.slice(0, maxLength);
}

// Generate response using semantic search
export async function generateKnowledgeBasedResponse(
  question: string,
  knowledgeBase: TreeNode[]
): Promise<string> {
  // Fallback if model not loaded yet
  if (!embedder) {
    return `⏳ 语义模型正在加载中，请稍后再试...\n\n或者刷新页面等待模型加载完成。`;
  }

  const documents = await findRelevantDocuments(question, knowledgeBase);
  const relevantDocs = documents.filter(doc => doc.relevance > 0.15).slice(0, 3);

  if (relevantDocs.length === 0) {
    return `抱歉，我在知识库中没有找到与"${question}"语义相关的内容。\n\n您可以：\n1. 尝试使用不同的表述方式提问\n2. 在左侧知识库目录中浏览相关文档\n3. 联系管理员添加相关文档`;
  }

  let response = `🔍 根据语义匹配，为您找到以下相关信息：\n\n`;

  relevantDocs.forEach((doc, index) => {
    const relevantContent = extractRelevantContent(question, doc.content);
    const similarityPercent = Math.round(doc.relevance * 100);
    response += `### 📄 ${doc.title} (匹配度: ${similarityPercent}%)\n`;
    response += `> 来源：${doc.breadcrumb.join(' > ')}\n\n`;
    response += `${relevantContent}\n\n`;
    if (index < relevantDocs.length - 1) {
      response += `---\n\n`;
    }
  });

  if (relevantDocs.length > 1) {
    response += `\n💡 **提示**：以上内容来自 ${relevantDocs.length} 篇相关文档，如需更详细的信息，可以在左侧目录中查看完整文档。`;
  }

  return response;
}

// Legacy sync version (for compatibility)
export function generateKnowledgeBasedResponseSync(
  _question: string,
  _knowledgeBase: TreeNode[]
): string {
  return `⏳ 语义模型正在加载中...\n\n请稍后再试，或刷新页面重新加载。`;
}

// Mock response function (kept for fallback)
export const mockAIResponse = (question: string): string => {
  const responses = [
    `根据知识库内容，关于"${question}"的问题，我为您整理了以下信息：\n\n这是一个很好的问题。知识库中有多篇相关文档可以参考。\n\n建议您查看相关文档获取更详细的信息。`,
    `感谢您的提问！\n\n关于"${question}"，我找到了以下相关内容：\n\n1. 首先需要了解基本概念\n2. 然后按照步骤操作\n3. 如有问题可以随时提问\n\n希望这能帮助到您！`,
    `您好！关于"${question}"的问题：\n\n根据知识库文档，这个问题的答案涉及到多个方面。建议您先查看相关文档，如果还有疑问可以继续追问。`
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};
