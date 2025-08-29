'use client'
import Sidebar from '../components/Sidebar';
import { usePathname } from 'next/navigation';

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCartPage = pathname === '/keranjang';
  return (
    <div className="flex w-screen h-screen overflow-hidden">
      <Sidebar />
      <main className={`flex-1 bg-white ${isCartPage ? 'overflow-hidden' : 'p-6 overflow-y-auto'}`}>{children}</main>
    </div>
  );
}
