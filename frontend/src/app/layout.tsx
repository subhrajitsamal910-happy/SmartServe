import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { ChatWidget } from '../components/ChatWidget';

export const metadata: Metadata = {
  title: 'SmartServe AI',
  description: 'AI-powered smart service marketplace with real-time booking intelligence.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <ChatWidget />
            <Toaster position='top-right' richColors closeButton />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
