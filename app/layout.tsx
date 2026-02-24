import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Positive Integer to Tree Bijection',
  description: 'Interactive visualization of the bijection between positive integers and rooted trees',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
