'use client'
import { usePathname } from 'next/navigation';

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCartPage = pathname === '/keranjang';
  return (
    <div className="flex">
      <main className={`bg-white w-screen ${isCartPage ? 'overflow-hidden' : 'p-6 overflow-y-auto'}`}>{children}</main>
    </div>
  
  );
}
