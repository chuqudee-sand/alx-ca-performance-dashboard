import './globals.css';
import { Inter } from 'next/font/google'; // Add this
import Sidebar from './components/Sidebar';

const inter = Inter({ subsets: ['latin'] }); // Initialize the font

export const metadata = {
  title: 'CA Revenue Command Center',
  description: 'Strategic $6M Revenue Tracking',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* Add the font class to the body */}
      <body className={`${inter.className} flex bg-slate-50 min-h-screen`}>
        <Sidebar />
        <main className="flex-1 ml-64 p-10">
          {children}
        </main>
      </body>
    </html>
  );
}
