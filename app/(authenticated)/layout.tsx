import Sidebar from '../components/Sidebar';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-screen relative">
      <Sidebar />
      <main className="bg-white w-full">{children}</main>
    </div>
  );
}
