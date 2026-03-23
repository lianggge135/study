# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Knowledge Base Q&A System** built with React + TypeScript + Vite. It features a three-column layout: chat sidebar (left), knowledge tree (center), and document viewer/chat panel (right). The app simulates AI-powered Q&A against a knowledge base using mock data.

**Source code is in the `knowledge-base/` subdirectory.**

## Common Commands

```bash
cd knowledge-base

npm run dev          # Start dev server with HMR
npm run build         # TypeScript check + Vite build
npm run lint          # ESLint check
npm run preview       # Preview production build locally
```

## Architecture

### Three-Column Layout
- **Left (ChatSidebar)**: Conversation list, new chat button, favorites access, knowledge manager access
- **Center (KnowledgeTree)**: Hierarchical folder/document tree with expand/collapse
- **Right (main-content)**: DocumentViewer (reading mode) or ChatPanel (chat mode), toggled by viewMode

### State Management
State is managed via `useLocalStorage` hook (no external state library). Key state:
- `conversations`: All chat conversations persisted in localStorage
- `knowledgeBase`: Tree structure of folders/documents persisted in localStorage
- `viewMode`: `'document' | 'chat' | 'manage'` - determines right panel content

### Data Flow
- `App.tsx` is the central state owner, passing callbacks to child components
- `findDocumentById()` recursively searches the knowledge tree
- `generateKnowledgeBasedResponse()` uses semantic embeddings for intelligent matching

### Key Types (`src/types/index.ts`)
- `Conversation` / `Message`: Chat data structures
- `TreeNode`: Knowledge base folder/document nodes
- `DocumentContent`: Document content with breadcrumb and source
- `AppState`: Union of all app-level state

### Semantic Search Implementation
Uses `@huggingface/transformers` with `Xenova/all-MiniLM-L6-v2` model for CPU-based semantic embeddings:
- Embeddings are cached to avoid recomputation
- Cosine similarity determines document relevance
- Model loads on app initialization (first load ~1-2 minutes, then cached)

Key exports from `mockData.ts`:
- `initEmbeddingModel()` - Loads the embedding model (call on app mount)
- `generateKnowledgeBasedResponse()` - Async semantic search function
- `isEmbeddingModelReady()` - Check model initialization status

## Deployment

Configured for Vercel (`vercel.json`). Build output goes to `dist/`. The `dist/` directory is already present in the repository root (separate from `knowledge-base/dist/`).

## Tech Stack
- React 19 + TypeScript
- Vite (build tool)
- CSS Modules (styling)
- ESLint flat config
- localStorage for persistence via custom `useLocalStorage` hook
- `@huggingface/transformers` for local semantic embeddings (CPU-based)
