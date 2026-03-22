import { useState, useCallback } from 'react';
import type { TreeNode } from '../../types';
import styles from './KnowledgeManager.module.css';

interface KnowledgeManagerProps {
  data: TreeNode[];
  onChange: (data: TreeNode[]) => void;
  onBack: () => void;
}

interface EditState {
  mode: 'create' | 'edit';
  node: TreeNode | null;
  parentId: string | null;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function findNodeById(nodes: TreeNode[], id: string): TreeNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

function deleteNodeById(nodes: TreeNode[], id: string): TreeNode[] {
  return nodes.filter(node => {
    if (node.id === id) return false;
    if (node.children) {
      node.children = deleteNodeById(node.children, id);
    }
    return true;
  });
}

function updateNodeById(nodes: TreeNode[], id: string, updates: Partial<TreeNode>): TreeNode[] {
  return nodes.map(node => {
    if (node.id === id) {
      return { ...node, ...updates };
    }
    if (node.children) {
      return { ...node, children: updateNodeById(node.children, id, updates) };
    }
    return node;
  });
}

function addNodeToParent(nodes: TreeNode[], parentId: string | null, newNode: TreeNode): TreeNode[] {
  if (!parentId) {
    return [...nodes, newNode];
  }
  return nodes.map(node => {
    if (node.id === parentId) {
      return {
        ...node,
        children: [...(node.children || []), newNode]
      };
    }
    if (node.children) {
      return { ...node, children: addNodeToParent(node.children, parentId, newNode) };
    }
    return node;
  });
}

interface TreeNodeItemProps {
  node: TreeNode;
  level: number;
  selectedId: string | null;
  expandedFolders: Set<string>;
  onSelect: (node: TreeNode) => void;
  onEdit: (node: TreeNode) => void;
  onDelete: (id: string) => void;
  onAddChild: (parentId: string) => void;
  onToggle: (id: string) => void;
}

function TreeNodeItem({
  node,
  level,
  selectedId,
  expandedFolders,
  onSelect,
  onEdit,
  onDelete,
  onAddChild,
  onToggle
}: TreeNodeItemProps) {
  const isExpanded = expandedFolders.has(node.id);
  const isSelected = selectedId === node.id;
  const isFolder = node.type === 'folder';
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className={styles['manager-node']}>
      <div
        className={`${styles['manager-node-content']} ${isSelected ? styles.selected : ''}`}
        style={{ paddingLeft: `${12 + level * 16}px` }}
        onClick={() => onSelect(node)}
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
              </svg>
            </span>
          </>
        )}
        <span className={styles['node-name']}>{node.name}</span>
        <div className={styles['node-actions']}>
          {isFolder && (
            <button
              className={styles['node-action-btn']}
              onClick={(e) => {
                e.stopPropagation();
                onAddChild(node.id);
              }}
              title="添加子项"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          )}
          <button
            className={styles['node-action-btn']}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(node);
            }}
            title="编辑"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            className={`${styles['node-action-btn']} ${styles.delete}`}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(node.id);
            }}
            title="删除"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
      {isFolder && hasChildren && isExpanded && (
        <div className={styles['node-children']}>
          {node.children!.map(child => (
            <TreeNodeItem
              key={child.id}
              node={child}
              level={level + 1}
              selectedId={selectedId}
              expandedFolders={expandedFolders}
              onSelect={onSelect}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CreateModalProps {
  parentId: string | null;
  parentName: string;
  onConfirm: (node: TreeNode) => void;
  onCancel: () => void;
}

function CreateModal({ parentId, parentName, onConfirm, onCancel }: CreateModalProps) {
  const [nodeType, setNodeType] = useState<'folder' | 'document'>('document');
  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  const handleConfirm = () => {
    if (!name.trim()) return;

    const newNode: TreeNode = {
      id: generateId(),
      name: name.trim(),
      type: nodeType,
      ...(nodeType === 'document' && {
        content: {
          title: name.trim(),
          content: content,
          breadcrumb: parentName ? [parentName, name.trim()] : [name.trim()],
          source: '用户创建'
        }
      }),
      ...(nodeType === 'folder' && { children: [] })
    };

    onConfirm(newNode);
  };

  return (
    <div className={styles['modal-overlay']} onClick={onCancel}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles['modal-header']}>
          <span className={styles['modal-title']}>新建{parentId ? `（在 ${parentName} 下）` : ''}</span>
          <button className={styles['modal-close']} onClick={onCancel}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className={styles['modal-body']}>
          <div className={styles['type-selector']}>
            <div
              className={`${styles['type-option']} ${nodeType === 'folder' ? styles.selected : ''}`}
              onClick={() => setNodeType('folder')}
            >
              <div className={styles['type-option-icon']}>📁</div>
              <div className={styles['type-option-label']}>文件夹</div>
            </div>
            <div
              className={`${styles['type-option']} ${nodeType === 'document' ? styles.selected : ''}`}
              onClick={() => setNodeType('document')}
            >
              <div className={styles['type-option-icon']}>📄</div>
              <div className={styles['type-option-label']}>文档</div>
            </div>
          </div>

          <div className={styles['form-group']}>
            <label className={styles['form-label']}>名称</label>
            <input
              type="text"
              className={styles['form-input']}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={nodeType === 'folder' ? '文件夹名称' : '文档名称'}
              autoFocus
            />
          </div>

          {nodeType === 'document' && (
            <div className={styles['form-group']}>
              <label className={styles['form-label']}>内容</label>
              <textarea
                className={styles['form-textarea']}
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="输入文档内容（支持 Markdown 格式）"
                style={{ minHeight: '150px' }}
              />
            </div>
          )}
        </div>
        <div className={styles['modal-footer']}>
          <button className={styles['btn-secondary']} onClick={onCancel}>取消</button>
          <button className={styles['btn-primary']} onClick={handleConfirm} disabled={!name.trim()}>确定</button>
        </div>
      </div>
    </div>
  );
}

export default function KnowledgeManager({ data, onChange, onBack }: KnowledgeManagerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['1', '2', '3']));
  const [editState, setEditState] = useState<EditState | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createParentId, setCreateParentId] = useState<string | null>(null);

  const selectedNode = selectedId ? findNodeById(data, selectedId) : null;

  const handleToggle = useCallback((id: string) => {
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

  const handleSelect = useCallback((node: TreeNode) => {
    setSelectedId(node.id);
    if (node.type === 'folder') {
      handleToggle(node.id);
    }
  }, [handleToggle]);

  const handleEdit = useCallback((node: TreeNode) => {
    setEditState({
      mode: 'edit',
      node: { ...node },
      parentId: null
    });
    setSelectedId(node.id);
  }, []);

  const handleDelete = useCallback((id: string) => {
    if (confirm('确定要删除此项吗？子项也会一并删除。')) {
      const newData = deleteNodeById([...data], id);
      onChange(newData);
      if (selectedId === id) {
        setSelectedId(null);
      }
    }
  }, [data, onChange, selectedId]);

  const handleAddChild = useCallback((parentId: string) => {
    setCreateParentId(parentId);
    setShowCreateModal(true);
    if (!expandedFolders.has(parentId)) {
      setExpandedFolders(prev => new Set(prev).add(parentId));
    }
  }, [expandedFolders]);

  const handleCreateNew = useCallback(() => {
    setCreateParentId(null);
    setShowCreateModal(true);
  }, []);

  const handleCreateConfirm = useCallback((newNode: TreeNode) => {
    const newData = addNodeToParent([...data], createParentId, newNode);
    onChange(newData);
    setShowCreateModal(false);
    setCreateParentId(null);
    setSelectedId(newNode.id);
  }, [data, onChange, createParentId]);

  const handleEditSave = useCallback(() => {
    if (!editState?.node) return;
    
    const newData = updateNodeById([...data], editState.node.id, editState.node);
    onChange(newData);
    setEditState(null);
  }, [data, onChange, editState]);

  const parentName = createParentId ? findNodeById(data, createParentId)?.name || '' : '';

  return (
    <div className={styles['knowledge-manager']}>
      <div className={styles['manager-header']}>
        <div className={styles['manager-title']}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
          知识库管理
        </div>
        <div className={styles['manager-actions']}>
          <button className={`${styles['action-btn']} ${styles.secondary}`} onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            返回
          </button>
          <button className={styles['action-btn']} onClick={handleCreateNew}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            新建
          </button>
        </div>
      </div>

      <div className={styles['manager-content']}>
        <div className={styles['tree-panel']}>
          <div className={styles['tree-toolbar']}>
            <span style={{ fontSize: '14px', color: '#666' }}>
              共 {data.length} 个顶级目录
            </span>
          </div>
          <div className={styles['tree-list']}>
            {data.map(node => (
              <TreeNodeItem
                key={node.id}
                node={node}
                level={0}
                selectedId={selectedId}
                expandedFolders={expandedFolders}
                onSelect={handleSelect}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddChild={handleAddChild}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </div>

        <div className={styles['edit-panel']}>
          {editState?.mode === 'edit' && editState.node ? (
            <div className={styles['edit-form']}>
              <div className={styles['edit-header']}>
                <h3 className={styles['edit-title']}>
                  编辑{editState.node.type === 'folder' ? '文件夹' : '文档'}
                </h3>
              </div>

              <div className={styles['form-group']}>
                <label className={styles['form-label']}>名称</label>
                <input
                  type="text"
                  className={styles['form-input']}
                  value={editState.node.name}
                  onChange={e => setEditState(prev => prev ? {
                    ...prev,
                    node: { ...prev.node!, name: e.target.value }
                  } : null)}
                />
              </div>

              {editState.node.type === 'document' && editState.node.content && (
                <>
                  <div className={styles['form-group']}>
                    <label className={styles['form-label']}>标题</label>
                    <input
                      type="text"
                      className={styles['form-input']}
                      value={editState.node.content.title}
                      onChange={e => setEditState(prev => prev ? {
                        ...prev,
                        node: {
                          ...prev.node!,
                          content: { ...prev.node!.content!, title: e.target.value }
                        }
                      } : null)}
                    />
                  </div>

                  <div className={styles['form-group']}>
                    <label className={styles['form-label']}>内容</label>
                    <textarea
                      className={styles['form-textarea']}
                      value={editState.node.content.content}
                      onChange={e => setEditState(prev => prev ? {
                        ...prev,
                        node: {
                          ...prev.node!,
                          content: { ...prev.node!.content!, content: e.target.value }
                        }
                      } : null)}
                    />
                  </div>

                  <div className={styles['form-group']}>
                    <label className={styles['form-label']}>来源</label>
                    <input
                      type="text"
                      className={styles['form-input']}
                      value={editState.node.content.source || ''}
                      onChange={e => setEditState(prev => prev ? {
                        ...prev,
                        node: {
                          ...prev.node!,
                          content: { ...prev.node!.content!, source: e.target.value }
                        }
                      } : null)}
                    />
                  </div>
                </>
              )}

              <div className={styles['edit-actions']}>
                <button className={styles['btn-secondary']} onClick={() => setEditState(null)}>
                  取消
                </button>
                <button className={styles['btn-primary']} onClick={handleEditSave}>
                  保存
                </button>
              </div>
            </div>
          ) : selectedNode ? (
            <div className={styles['edit-form']}>
              <div className={styles['edit-header']}>
                <h3 className={styles['edit-title']}>{selectedNode.name}</h3>
              </div>
              <div style={{ color: '#666', marginBottom: '16px' }}>
                类型：{selectedNode.type === 'folder' ? '文件夹' : '文档'}
              </div>
              {selectedNode.type === 'document' && selectedNode.content && (
                <>
                  <div className={styles['form-group']}>
                    <label className={styles['form-label']}>标题</label>
                    <div style={{ padding: '10px 0', color: '#333' }}>{selectedNode.content.title}</div>
                  </div>
                  <div className={styles['form-group']}>
                    <label className={styles['form-label']}>内容预览</label>
                    <div style={{ 
                      padding: '12px', 
                      background: '#f5f7fa', 
                      borderRadius: '6px',
                      maxHeight: '300px',
                      overflow: 'auto',
                      whiteSpace: 'pre-wrap',
                      fontSize: '13px',
                      lineHeight: '1.6'
                    }}>
                      {selectedNode.content.content}
                    </div>
                  </div>
                  <button 
                    className={styles['btn-primary']}
                    onClick={() => handleEdit(selectedNode)}
                    style={{ marginTop: '16px' }}
                  >
                    编辑
                  </button>
                </>
              )}
              {selectedNode.type === 'folder' && (
                <>
                  <div style={{ color: '#666', marginBottom: '16px' }}>
                    子项数量：{selectedNode.children?.length || 0}
                  </div>
                  <button 
                    className={styles['btn-primary']}
                    onClick={() => handleEdit(selectedNode)}
                    style={{ marginTop: '16px' }}
                  >
                    编辑
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className={styles['empty-edit']}>
              <div className={styles['empty-icon']}>📝</div>
              <div className={styles['empty-text']}>选择一个条目进行编辑</div>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <CreateModal
          parentId={createParentId}
          parentName={parentName}
          onConfirm={handleCreateConfirm}
          onCancel={() => {
            setShowCreateModal(false);
            setCreateParentId(null);
          }}
        />
      )}
    </div>
  );
}
