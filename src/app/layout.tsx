// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Poppins } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Script from 'next/script';
import { AuthProvider } from '../contexts/auth-context'; // Relative import

const poppins = Poppins({ 
  subsets: ['latin'], 
  weight: ['400', '600', '800'],
  variable: '--font-poppins' 
});

export const metadata: Metadata = {
  title: 'MedBridge',
  description: 'MedBridge - Your Health Friend',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans antialiased`}>
        {/* Wrap the entire app in AuthProvider */}
        <AuthProvider>
          {/* Wrap in ThemeProvider */}
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* Main content of pages */}
            {children}

            {/* Global Toaster for notifications */}
            <Toaster />

            {/* Optional external scripts */}
            <Script
              src="https://cdnjs.cloudflare.com/ajax/libs/react/17.0.2/umd/react.production.min.js"
              strategy="afterInteractive"
              defer
            />
            <Script
              src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/17.0.2/umd/react-dom.production.min.js"
              strategy="afterInteractive"
              defer
            />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
