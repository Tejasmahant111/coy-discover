import './globals.css';
import TabBar from '../components/TabBar.js';

export const metadata = {
  title: 'Coy — Discover',
  description: 'Swipe-based Discover tab prototype for Coy.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#fff6f8',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app">
          <main className="app__main">{children}</main>
          <TabBar />
        </div>
      </body>
    </html>
  );
}
