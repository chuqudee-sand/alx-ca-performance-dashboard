// app/components/Sidebar.tsx
import Link from 'next/link';

export default function Sidebar() {
  return (
    <nav className="w-64 bg-[#002B56] text-white flex flex-col p-6 h-full">
      <div className="text-2xl font-bold text-[#05F283] mb-10">CA Command</div>
      
      <ul className="space-y-4 flex-1">
        <li>
          <Link href="/" className="hover:text-[#05F283] transition-colors">
            Executive Overview
          </Link>
        </li>
        <li>
          <Link href="/deep-dive" className="hover:text-[#05F283] transition-colors">
            Program Deep-Dive
          </Link>
        </li>
        <li>
          <Link href="/historical" className="hover:text-[#05F283] transition-colors">
            Historical Data
          </Link>
        </li>
        <li>
          <Link href="/forecasting" className="hover:text-[#05F283] transition-colors">
            Revenue Forecasting
          </Link>
        </li>
      </ul>

      <div className="text-xs text-slate-400 border-t border-slate-700 pt-4">
        System Architecture v5.5
      </div>
    </nav>
  );
}
