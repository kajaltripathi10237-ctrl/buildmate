import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BuildMate | Construction Workforce Platform',
  description: 'Modern construction ecosystem for contractors, workers, vendors and admins.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
