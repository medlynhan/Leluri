'use client'
import { usePathname } from 'next/navigation';

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCartPage = pathname === '/keranjang';
  return (
    <div className="w-screen  min-h-screen ">
      <main className={`bg-white w-screen ${isCartPage ? 'overflow-hidden' : ' overflow-y-auto'}`}>{children}</main>
    </div>
  
  );
}
