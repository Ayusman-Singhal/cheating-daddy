import React from 'react';
import styles from './Textarea.module.css';

export const Textarea = React.forwardRef(({ 
  className = '',
  error = false,
  ...props 
}, ref) => {
  return (
    <textarea
      ref={ref}
      className={`${styles.textarea} ${error ? styles.error : ''} ${className}`}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';
