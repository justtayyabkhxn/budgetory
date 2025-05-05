// app/layout.tsx
// import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css'; // if you have global styles

export const metadata = {
  title: 'Budgetory',
  description: 'Your budget. Your story.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
