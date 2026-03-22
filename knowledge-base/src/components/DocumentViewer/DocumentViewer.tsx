import type { DocumentContent } from '../../types';
import styles from './DocumentViewer.module.css';

interface DocumentViewerProps {
  document: DocumentContent | null;
}

function renderMarkdown(content: string): string {
  let html = content;
  
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
  
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  
  html = html.replace(/^\* (.+)$/gm, '<li>$1</li>');
  html = html.replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>');
  
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  html = html.replace(/\n\n/g, '</p><p>');
  html = `<p>${html}</p>`;
  
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>(<h[23]>)/g, '$1');
  html = html.replace(/(<\/h[23]>)<\/p>/g, '$1');
  html = html.replace(/<p>(<pre>)/g, '$1');
  html = html.replace(/(<\/pre>)<\/p>/g, '$1');
  html = html.replace(/<p>(<li>)/g, '<ul>$1');
  html = html.replace(/(<\/li>)<\/p>/g, '$1</ul>');
  
  return html;
}

export default function DocumentViewer({ document }: DocumentViewerProps) {
  if (!document) {
    return (
      <div className={styles['document-viewer']}>
        <div className={styles['empty-viewer']}>
          <div className={styles['empty-icon']}>📄</div>
          <div className={styles['empty-title']}>选择一个文档</div>
          <div className={styles['empty-text']}>从左侧知识库目录中选择文档查看内容</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['document-viewer']}>
      <div className={styles['viewer-header']}>
        <div className={styles.breadcrumb}>
          {document.breadcrumb.map((item, index) => (
            <span key={index}>
              {index > 0 && <span className={styles['breadcrumb-separator']}>/</span>}
              {index === document.breadcrumb.length - 1 ? (
                <span className={styles['breadcrumb-current']}>{item}</span>
              ) : (
                <span className={styles['breadcrumb-item']}>{item}</span>
              )}
            </span>
          ))}
        </div>
      </div>

      <div className={styles['viewer-content']}>
        <h1 className={styles['document-title']}>{document.title}</h1>
        <div 
          className={styles['document-body']}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(document.content) }}
        />
        {document.source && (
          <div className={styles['document-source']}>
            来源：{document.source}
          </div>
        )}
      </div>
    </div>
  );
}
