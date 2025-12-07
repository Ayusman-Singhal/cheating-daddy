import React from 'react';
import styles from './Button.module.css';

export const Button = React.forwardRef(({ 
  children, 
  variant = 'default', 
  size = 'default',
  className = '',
  disabled = false,
  type = 'button',
  ...props 
}, ref) => {
  const variantClass = styles[variant] || styles.default;
  const sizeClass = styles[size] || styles.defaultSize;
  
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={`${styles.button} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
