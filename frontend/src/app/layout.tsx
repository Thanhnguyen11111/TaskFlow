import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../hooks/use-auth';
import { ToastProvider } from '../components/ui/toast';

export const metadata: Metadata = {
  title: 'TaskFlow – Smart Task Management',
  description: 'Full-stack task management web application built with Next.js, NestJS, and Prisma',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
