import { ReactNode } from 'react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthLayout({ subtitle, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* Title and Subtitle */}
        <div className="mt-20 text-center">
          <h1 className="mt-2 text-foreground">
            {subtitle}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="px-4 py-8 sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}
