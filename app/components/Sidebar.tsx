"use client";
import Link from 'next/link';

export default function Sidebar() {
  return (
    <nav className="w-64 bg-[#002B56] text-white flex flex-col p-6 h-screen fixed left-0 top-0">
      <div className="text-2xl font-bold text-[#05F283] mb-10">CA Command</div>
      <ul className="space-y-4 flex-1">
        <li>
          <Link href="/" className="hover:text-[#05F283] block">Executive Overview</Link>
        </li>
        <li>
          <Link href="/historical" className="hover:text-[#05F283] block">Historical Data</Link>
        </li>
        {/* Add other links similarly */}
      </ul>
      <div className="text-xs text-slate-400 border-t border-slate-700 pt-4">
        System Architecture v5.5
      </div>
    </nav>
  );
}
