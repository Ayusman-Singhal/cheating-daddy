import React from 'react';
import styles from './Card.module.css';

export const Card = React.forwardRef(({ 
  children, 
  className = '',
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={`${styles.card} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export const CardHeader = React.forwardRef(({ 
  children, 
  className = '',
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={`${styles.cardHeader} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef(({ 
  children, 
  className = '',
  ...props 
}, ref) => {
  return (
    <h3
      ref={ref}
      className={`${styles.cardTitle} ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
});

CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef(({ 
  children, 
  className = '',
  ...props 
}, ref) => {
  return (
    <p
      ref={ref}
      className={`${styles.cardDescription} ${className}`}
      {...props}
    >
      {children}
    </p>
  );
});

CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef(({ 
  children, 
  className = '',
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={`${styles.cardContent} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef(({ 
  children, 
  className = '',
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={`${styles.cardFooter} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

CardFooter.displayName = 'CardFooter';
