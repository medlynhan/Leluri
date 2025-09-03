'use client'
import { usePathname } from 'next/navigation';
import SideBar from '@/components/Sidebar'

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCartPage = pathname === '/keranjang';
  return (
    <div className="relative flex w-screen relative min-h-screen">
      <SideBar />
      <main className={`bg-white w-screen ${isCartPage && 'overflow-hidden'}`}>{children}</main>
    </div>
  );
}
