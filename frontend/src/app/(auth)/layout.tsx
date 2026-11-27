import React from 'react';
import { CheckCheck } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50/30 to-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white shadow-md mb-3">
          <CheckCheck className="w-7 h-7" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Task<span className="text-indigo-600">Flow</span>
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Streamline your day, prioritize what matters.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl sm:rounded-2xl border border-gray-100 sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}
