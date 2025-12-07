import React, { useEffect, useRef } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import styles from './MarkdownRenderer.module.css';

export const MarkdownRenderer = ({ content, className = '' }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      // Apply syntax highlighting to all code blocks
      const codeBlocks = containerRef.current.querySelectorAll('pre code');
      codeBlocks.forEach((block) => {
        hljs.highlightElement(block);
      });
    }
  }, [content]);

  const html = marked.parse(content || '', {
    breaks: true,
    gfm: true,
  });

  return (
    <div
      ref={containerRef}
      className={`${styles.markdown} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
