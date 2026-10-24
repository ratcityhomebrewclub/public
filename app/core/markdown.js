import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import { getContent } from './content';
import { withBase } from './paths';

// Root-relative image/link URLs in markdown are written without the
// GitHub Pages base path, so add it here.
const components = {
  img: ({ node, src, alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={withBase(src)} alt={alt ?? ''} loading="lazy" {...props} />
  ),
  a: ({ node, href, ...props }) => {
    const external = /^https?:\/\//.test(href ?? '');
    return (
      <a
        href={withBase(href)}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...props}
      />
    );
  },
};

export default function Markdown({ file, source, className = '' }) {
  const content = source ?? getContent(file);
  return (
    <div className={`markdown ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkBreaks]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
