import Link from 'next/link';

const Sidebar = () => {
  return (
    <nav className="w-64 bg-[#002B56] text-white flex flex-col h-screen p-6 fixed left-0 top-0">
      <div className="text-2xl font-bold text-[#05F283] mb-10">CA Command</div>
      
      <ul className="space-y-6 flex-1">
        <li>
          <Link href="/" className="hover:text-[#05F283] transition-colors font-medium">
            Executive Overview
          </Link>
        </li>
        <li>
          <Link href="/historical" className="hover:text-[#05F283] transition-colors font-medium">
            Historical Analysis
          </Link>
        </li>
      </ul>

      <div className="text-[10px] text-slate-400 border-t border-slate-700 pt-4 uppercase tracking-widest">
        Automated Revenue System
      </div>
    </nav>
  );
};

export default Sidebar;
