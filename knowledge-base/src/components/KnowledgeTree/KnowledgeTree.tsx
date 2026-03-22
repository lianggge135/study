import { useState, useMemo } from 'react';
import type { TreeNode } from '../../types';
import styles from './KnowledgeTree.module.css';

interface KnowledgeTreeProps {
  data: TreeNode[];
  selectedDocumentId: string | null;
  expandedFolders: Set<string>;
  onSelectDocument: (id: string) => void;
  onToggleFolder: (id: string) => void;
}

interface TreeNodeItemProps {
  node: TreeNode;
  level: number;
  selectedDocumentId: string | null;
  expandedFolders: Set<string>;
  searchQuery: string;
  onSelectDocument: (id: string) => void;
  onToggleFolder: (id: string) => void;
}

function TreeNodeItem({
  node,
  level,
  selectedDocumentId,
  expandedFolders,
  searchQuery,
  onSelectDocument,
  onToggleFolder
}: TreeNodeItemProps) {
  const isExpanded = expandedFolders.has(node.id);
  const isSelected = selectedDocumentId === node.id;
  const isFolder = node.type === 'folder';
  const hasChildren = node.children && node.children.length > 0;

  const matchesSearch = searchQuery === '' || 
    node.name.toLowerCase().includes(searchQuery.toLowerCase());

  const childMatchesSearch = !isFolder || !node.children ? false :
    node.children.some(child => 
      child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (child.children && child.children.some(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      ))
    );

  if (!matchesSearch && !childMatchesSearch) {
    return null;
  }

  const handleClick = () => {
    if (isFolder) {
      onToggleFolder(node.id);
    } else {
      onSelectDocument(node.id);
    }
  };

  return (
    <div className={styles['tree-node']}>
      <div
        className={`${styles['node-content']} ${isSelected ? styles.selected : ''}`}
        style={{ paddingLeft: `${12 + level * 16}px` }}
        onClick={handleClick}
      >
        {isFolder ? (
          <>
            <span className={`${styles['node-toggle']} ${isExpanded ? styles.expanded : ''} ${!hasChildren ? styles.hidden : ''}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </span>
            <span className={`${styles['node-icon']} ${styles['folder-icon']}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </span>
          </>
        ) : (
          <>
            <span className={`${styles['node-toggle']} ${styles.hidden}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </span>
            <span className={`${styles['node-icon']} ${styles['document-icon']}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </span>
          </>
        )}
        <span className={styles['node-name']}>{node.name}</span>
      </div>
      {isFolder && hasChildren && (
        <div className={`${styles['node-children']} ${!isExpanded ? styles.collapsed : ''}`}>
          {node.children!.map(child => (
            <TreeNodeItem
              key={child.id}
              node={child}
              level={level + 1}
              selectedDocumentId={selectedDocumentId}
              expandedFolders={expandedFolders}
              searchQuery={searchQuery}
              onSelectDocument={onSelectDocument}
              onToggleFolder={onToggleFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function KnowledgeTree({
  data,
  selectedDocumentId,
  expandedFolders,
  onSelectDocument,
  onToggleFolder
}: KnowledgeTreeProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    
    const filterNodes = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.reduce((acc: TreeNode[], node) => {
        const matches = node.name.toLowerCase().includes(searchQuery.toLowerCase());
        const childMatches = node.children ? filterNodes(node.children) : [];
        
        if (matches || childMatches.length > 0) {
          acc.push({
            ...node,
            children: childMatches.length > 0 ? childMatches : node.children
          });
        }
        return acc;
      }, []);
    };
    
    return filterNodes(data);
  }, [data, searchQuery]);

  return (
    <div className={styles['knowledge-tree']}>
      <div className={styles['tree-header']}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
        知识库
      </div>
      
      <div className={styles['tree-search']}>
        <input
          type="text"
          className={styles['search-input']}
          placeholder="搜索文档..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className={styles['tree-content']}>
        {filteredData.length === 0 ? (
          <div className={styles['empty-tree']}>
            <div className={styles['empty-icon']}>📁</div>
            <div className={styles['empty-text']}>
              {searchQuery ? '未找到匹配的文档' : '知识库为空'}
            </div>
          </div>
        ) : (
          filteredData.map(node => (
            <TreeNodeItem
              key={node.id}
              node={node}
              level={0}
              selectedDocumentId={selectedDocumentId}
              expandedFolders={expandedFolders}
              searchQuery={searchQuery}
              onSelectDocument={onSelectDocument}
              onToggleFolder={onToggleFolder}
            />
          ))
        )}
      </div>
    </div>
  );
}
