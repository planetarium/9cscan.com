import React from 'react';
import type { ReactNode } from 'react';

interface LinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
}

export default function Link({ href, children, className = '', external = false }: LinkProps) {
  const baseClasses = 'text-bright-blue font-bold transition-colors';
  const combinedClasses = `${baseClasses} ${className}`.trim();

  if (external) {
    return (
      <a href={href} className={combinedClasses} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <a href={href} className={combinedClasses}>
      {children}
    </a>
  );
}
