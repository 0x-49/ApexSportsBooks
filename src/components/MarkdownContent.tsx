import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Components } from 'react-markdown';

interface MarkdownContentProps {
  url: string;
}

interface ChunkInfo {
  position: number;
  text: string;
  headers: { type: string; text: string }[];
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({ url }) => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        console.log('Attempting to fetch content from:', url);
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'text/markdown,text/plain,application/json,*/*'
          },
          mode: 'cors'
        });
        
        if (!response.ok) {
          console.error('Response not OK:', {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries())
          });
          throw new Error(`Failed to fetch content: ${response.status} ${response.statusText}`);
        }

        // Try to determine if the response is JSON or plain text
        const contentType = response.headers.get('content-type');
        let text;
        
        if (contentType && contentType.includes('application/json')) {
          // Handle JSON response (chunked format)
          const data = await response.json();
          console.log('Received JSON data:', data);
          
          // Extract and sort chunks
          const chunks: ChunkInfo[] = data.map((item: any) => ({
            position: item.position,
            text: item.text || '',
            headers: item.headers || []
          }));
          
          // Sort chunks by position
          chunks.sort((a, b) => a.position - b.position);
          
          // Combine all chunks
          text = chunks.map(chunk => {
            const headerContent = chunk.headers
              .map(header => `${'#'.repeat(header.type === 'MARKDOWN_NODE_TYPE_HEADER_1' ? 1 : 2)} ${header.text}\n\n`)
              .join('');
            return headerContent + chunk.text;
          }).join('\n\n');
        } else {
          // Handle plain text/markdown response
          text = await response.text();
          console.log('Received text content length:', text.length);
        }
        
        if (!text.trim()) {
          throw new Error('Received empty content');
        }
        
        setContent(text);
        setError(null);
      } catch (err) {
        console.error('Error fetching markdown content:', err);
        let errorMessage = err instanceof Error ? err.message : 'Failed to load content';
        if (err instanceof TypeError && err.message.includes('CORS')) {
          errorMessage = 'CORS error: The server is not allowing access to this content. Please check CORS settings.';
        }
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    fetchContent();
  }, [url]);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-600 font-medium mb-2">Error loading content:</div>
        <div className="text-red-500">{error}</div>
        <div className="mt-2 text-sm text-gray-500 break-all">
          Attempted URL: {url}
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Please check the browser console for more details.
        </div>
      </div>
    );
  }

  const components: Components = {
    code({ className, children }) {
      const match = /language-(\w+)/.exec(className || '');
      return match ? (
        <SyntaxHighlighter
          style={tomorrow}
          language={match[1]}
          PreTag="div"
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className}>
          {children}
        </code>
      );
    },
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold mb-6 mt-8">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold mb-4 mt-6">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-bold mb-3 mt-5">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="text-gray-700 mb-4 leading-relaxed">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="mb-1">{children}</li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600">{children}</blockquote>
    ),
    a: ({ href, children }) => (
      <a 
        className="text-blue-600 hover:text-blue-800 underline" 
        target="_blank"
        rel="noopener noreferrer"
        href={href}
      >
        {children}
      </a>
    ),
    img: ({ src, alt }) => (
      <img 
        className="rounded-lg shadow-md my-4 max-w-full h-auto"
        loading="lazy"
        src={src}
        alt={alt}
      />
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full divide-y divide-gray-200">{children}</table>
      </div>
    ),
    th: ({ children }) => (
      <th className="px-4 py-2 bg-gray-50 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">{children}</th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{children}</td>
    ),
  };

  return (
    <article className="prose prose-lg max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
};

export default MarkdownContent;
