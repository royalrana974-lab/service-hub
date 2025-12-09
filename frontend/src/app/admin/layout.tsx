import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel - ServiceHub',
  description: 'ServiceHub Admin Dashboard',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
