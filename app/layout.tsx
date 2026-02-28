import './globals.css';
import Sidebar from './components/Sidebar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex bg-slate-50 min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-64 p-10">
          {children}
        </main>
      </body>
    </html>
  );
}
