import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin/auth';
import AdminSidebar from '../components/AdminSidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 ml-64">
        {children}
      </main>
    </div>
  );
}
