import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dictation App',
  description: 'Practice English dictation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col relative bg-slate-50 text-slate-800`}>
        {/* Background Decorative Blob */}
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-50 -z-10 rounded-b-[40%] opacity-70 blur-3xl"></div>
        
        <header className="glass-panel sticky top-0 z-50 border-b border-slate-200/50">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold gradient-text tracking-tight flex items-center gap-2">
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
              DictatePro
            </Link>
            <nav className="flex gap-6">
              <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all">Library</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
          {children}
        </main>
      </body>
    </html>
  )
}
