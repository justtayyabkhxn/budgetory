// app/layout.tsx
// import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css'; // if you have global styles
import { GeistSans } from "geist/font/sans"; // import font


export const metadata = {
  title: 'Budgetory',
  description: 'Your budget. Your story.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.className} antialiased dark:bg-gray-950`}>
      <body>{children}</body>
    </html>
  );
}
