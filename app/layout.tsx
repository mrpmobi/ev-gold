import type { Metadata } from 'next'
import { Epilogue } from 'next/font/google';
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mobi',
  description: 'Created by MRP Mobi',
  generator: 'Mobi',
}

const epilogue = Epilogue({ 
  subsets: ['latin'],
  variable: '--font-epilogue'
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${epilogue.variable} ${GeistMono.variable}`}>
      <body className={epilogue.className}>{children}</body>
    </html>
  )
}