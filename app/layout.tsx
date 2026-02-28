import './globals.css';
import Sidebar from './components/Sidebar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, display: 'flex', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <Sidebar />
        {/* Added marginLeft: '256px' to stop the overlap */}
        <main style={{ marginLeft: '256px', flex: 1, padding: '40px', boxSizing: 'border-box' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
