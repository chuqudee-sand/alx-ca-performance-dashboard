// app/layout.tsx
import './globals.css';
import Sidebar from './components/Sidebar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex h-screen bg-slate-50">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-berkeleyBlue text-white flex flex-col p-6">
          <div className="text-2xl font-bold text-springGreen mb-10">CA Command</div>
          <ul className="space-y-4 flex-1">
            <li className="hover:text-springGreen cursor-pointer">Executive Overview</li>
            <li className="hover:text-springGreen cursor-pointer">Program Deep-Dive</li>
            <li className="hover:text-springGreen cursor-pointer">Historical Data</li>
            <li className="hover:text-springGreen cursor-pointer">Revenue Forecasting</li>
          </ul>
          <div className="text-xs text-slate-400 border-t border-slate-700 pt-4">
            System Architecture v5.5
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-10">
          {children}
        </main>
      </body>
    </html>
  );
}
