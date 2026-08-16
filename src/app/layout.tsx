import './globals.css';
import type { Metadata } from 'next';
import { Header } from '../components/layout/Header';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const metadata: Metadata = {
  title: 'New Meera Chemist | 24/7 Online Pharmacy & Healthcare Store',
  description: 'Order genuine prescription medicines, healthcare devices, vitamins & ayurvedic products online with 24-hour home delivery across India.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased text-slate-900 bg-slate-50 flex flex-col min-h-screen">
        <Header />
        <Navbar />
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
