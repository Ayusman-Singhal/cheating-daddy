import React from 'react';
import styles from './Input.module.css';

export const Input = React.forwardRef(({ 
  type = 'text',
  className = '',
  error = false,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={`${styles.input} ${error ? styles.error : ''} ${className}`}
      {...props}
    />
  );
});

Input.displayName = 'Input';
