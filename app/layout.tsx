// app/layout.tsx
import './globals.css';
import Sidebar from './components/Sidebar'; // Ensure this file exists at app/components/Sidebar.tsx

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex h-screen bg-slate-50">
        {/* 1. Use the actual Sidebar Component */}
        <Sidebar />

        {/* 2. Main Content Area */}
        {/* We add 'ml-64' if your Sidebar.tsx uses 'fixed' positioning, 
            otherwise the flex layout handles it. */}
        <main className="flex-1 overflow-y-auto p-10">
          {children}
        </main>
      </body>
    </html>
  );
}
