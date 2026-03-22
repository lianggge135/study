import type { TreeNode, Conversation } from '../types';

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

interface SearchResult {
  title: string;
  content: string;
  breadcrumb: string[];
  relevance: number;
}

function extractAllDocuments(nodes: TreeNode[], results: SearchResult[] = []): SearchResult[] {
  for (const node of nodes) {
    if (node.type === 'document' && node.content) {
      results.push({
        title: node.content.title,
        content: node.content.content,
        breadcrumb: node.content.breadcrumb,
        relevance: 0
      });
    }
    if (node.children) {
      extractAllDocuments(node.children, results);
    }
  }
  return results;
}

function extractKeywords(text: string): string[] {
  const keywords: string[] = [];
  
  const words = text.split(/[\s,，。！？、；：""''（）【】《》\n\r\t]+/).filter(w => w.length > 0);
  keywords.push(...words);
  
  for (let i = 0; i < text.length; i++) {
    for (let len = 2; len <= 4; len++) {
      if (i + len <= text.length) {
        const char = text[i];
        if (/[\u4e00-\u9fa5]/.test(char)) {
          keywords.push(text.slice(i, i + len));
        }
      }
    }
  }
  
  return [...new Set(keywords)];
}

function calculateRelevance(question: string, document: SearchResult): number {
  const questionLower = question.toLowerCase();
  const keywords = extractKeywords(questionLower);
  
  const titleLower = document.title.toLowerCase();
  const contentLower = document.content.toLowerCase();
  
  let score = 0;
  
  for (const keyword of keywords) {
    if (keyword.length < 2) continue;
    
    if (titleLower.includes(keyword)) {
      score += 10 * keyword.length;
    }
    
    const contentMatches = (contentLower.match(new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    score += contentMatches * keyword.length;
  }
  
  const exactPhrases = [
    { pattern: /如何|怎么|怎样|方法/, weight: 1 },
    { pattern: /什么|是什么|含义/, weight: 1 },
    { pattern: /为什么|原因/, weight: 1 },
    { pattern: /功能|特性|特点/, weight: 1 },
    { pattern: /API|接口|调用/, weight: 2 },
    { pattern: /架构|设计|技术栈/, weight: 2 },
    { pattern: /新建|创建|添加/, weight: 1 },
    { pattern: /收藏|保存/, weight: 1 },
    { pattern: /位于|位置|在哪|哪里|地理/, weight: 2 },
    { pattern: /首都|城市|国家/, weight: 2 },
    { pattern: /人口|面积/, weight: 2 }
  ];
  
  for (const { pattern, weight } of exactPhrases) {
    if (pattern.test(questionLower) && pattern.test(contentLower)) {
      score += weight * 5;
    }
  }
  
  return score;
}

function extractRelevantContent(question: string, content: string, maxLength: number = 500): string {
  const questionLower = question.toLowerCase();
  const keywords = extractKeywords(questionLower);
  
  const lines = content.split('\n').filter(line => line.trim());
  
  const relevantLines: string[] = [];
  let currentLength = 0;
  
  for (const line of lines) {
    const lineLower = line.toLowerCase();
    const isRelevant = keywords.some(keyword => keyword.length >= 2 && lineLower.includes(keyword)) ||
                       line.startsWith('##') ||
                       line.startsWith('###') ||
                       line.startsWith('**') ||
                       line.startsWith('- ') ||
                       line.startsWith('1. ') ||
                       line.startsWith('2. ') ||
                       line.startsWith('3. ');
    
    if (isRelevant && currentLength + line.length < maxLength) {
      relevantLines.push(line);
      currentLength += line.length;
    }
  }
  
  if (relevantLines.length === 0) {
    return content.slice(0, maxLength) + (content.length > maxLength ? '...' : '');
  }
  
  return relevantLines.join('\n');
}

export function generateKnowledgeBasedResponse(question: string, knowledgeBase: TreeNode[]): string {
  const documents = extractAllDocuments(knowledgeBase);
  
  for (const doc of documents) {
    doc.relevance = calculateRelevance(question, doc);
  }
  
  documents.sort((a, b) => b.relevance - a.relevance);
  
  const relevantDocs = documents.filter(doc => doc.relevance > 0).slice(0, 3);
  
  if (relevantDocs.length === 0) {
    return `抱歉，我在知识库中没有找到与"${question}"直接相关的内容。\n\n您可以：\n1. 尝试使用不同的关键词重新提问\n2. 在左侧知识库目录中浏览相关文档\n3. 联系管理员添加相关文档`;
  }
  
  let response = `根据知识库内容，为您找到以下相关信息：\n\n`;
  
  relevantDocs.forEach((doc, index) => {
    const relevantContent = extractRelevantContent(question, doc.content);
    response += `### 📄 ${doc.title}\n`;
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

export const mockAIResponse = (question: string): string => {
  const responses = [
    `根据知识库内容，关于"${question}"的问题，我为您整理了以下信息：\n\n这是一个很好的问题。知识库中有多篇相关文档可以参考。\n\n建议您查看相关文档获取更详细的信息。`,
    `感谢您的提问！\n\n关于"${question}"，我找到了以下相关内容：\n\n1. 首先需要了解基本概念\n2. 然后按照步骤操作\n3. 如有问题可以随时提问\n\n希望这能帮助到您！`,
    `您好！关于"${question}"的问题：\n\n根据知识库文档，这个问题的答案涉及到多个方面。建议您先查看相关文档，如果还有疑问可以继续追问。`
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};
