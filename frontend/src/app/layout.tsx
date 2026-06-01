import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/providers/QueryProvider'

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'TaskFlow',
  description: 'Gerencie suas tarefas de forma simples e eficiente',
  icons: {
    icon: '/taskflow-logo.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} h-full antialiased`}>
      <body className={`min-h-full flex flex-col ${poppins.className}`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
