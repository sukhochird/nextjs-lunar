import type { Metadata } from 'next';
import { CartProvider } from '@/contexts/CartContext';
import '../styles/globals.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export const metadata: Metadata = {
  title: 'Цагаан сарын цахим экспо',
  description: 'Цагаан сарын цахим экспо',
  keywords: 'цагаан сар, экспо, Mongolia',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn">
      <body className="antialiased">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}