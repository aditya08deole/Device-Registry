'use client'

import Link from 'next/link'

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 glass-panel flex items-center justify-between px-8 z-50 border-b border-white/10">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-[10px] text-white font-black tracking-tighter">EVR</span>
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-none uppercase">EvaraTech</h1>
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-accent mt-1 leading-none">Global Network Portal</p>
        </div>
      </Link>
      
      <div className="flex items-center space-x-6">
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Link Active</span>
          </div>
          <div className="h-4 w-[1px] bg-slate-200"></div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            v4.2.0-PROVISIONING
          </div>
        </div>
      </div>
    </header>
  )
}
