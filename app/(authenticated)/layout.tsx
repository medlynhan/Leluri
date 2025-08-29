import Sidebar from '../components/Sidebar';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <main className=" bg-white w-screen ">{children}</main>
    </div>
  );
}
