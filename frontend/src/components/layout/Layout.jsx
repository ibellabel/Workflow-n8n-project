import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50/50 selection:bg-blue-100 selection:text-blue-900 font-sans">
      <Navbar />
      <Sidebar />
      <main className="pl-64 pt-16 min-h-screen transition-all">
        <div className="mx-auto max-w-5xl p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
