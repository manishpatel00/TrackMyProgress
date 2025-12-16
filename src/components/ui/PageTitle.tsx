import React from 'react';

interface PageTitleProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageTitle({ title, description, children }: PageTitleProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {children && (
        <div className="mt-4 sm:mt-0">{children}</div>
      )}
    </div>
  );
}
