"use client";
import { usePathname } from "next/navigation";
import SideBar from "@/components/Sidebar";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCartPage = pathname === "/keranjang";

  // route yang tidak pakai sidebar
  const noSidebarRoutes: (string | RegExp)[] = [
    "/toko/saya",       // langsung cocok string
    /^\/toko\/[^/]+$/,   // regex untuk /toko/apa-saja (1 segmen saja = [id])
    "/kelas/saya",
    "/pembayaran",
    "/post",
    "/keranjang",
    /^\/kelas\/details\/[^/]+$/,
    "/profile/followers",
    "/profile/following",
    /^\/profile\/[^/]+$/,
  ];

  const hideSidebar = noSidebarRoutes.some((rule) =>
    rule instanceof RegExp ? rule.test(pathname) : pathname.startsWith(rule)
  );

  return (
    <div className="relative flex w-screen min-h-screen">
      {!hideSidebar && <SideBar />}
      <main className={`bg-white w-screen ${isCartPage ? "overflow-hidden" : ""}`}>
        {children}
      </main>
    </div>
  );
}
