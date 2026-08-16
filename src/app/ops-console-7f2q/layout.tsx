import React from 'react';
import type { Metadata } from 'next';
import AdminLayoutClient from '@/app/ops-console-7f2q/AdminLayoutClient';

export const metadata: Metadata = {
  title: 'Operations Console',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
