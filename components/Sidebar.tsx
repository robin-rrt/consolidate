'use client';

import { User, ArrowLeftRight, Globe } from 'lucide-react';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-56 h-full bg-[#E1FFDD] p-4 flex flex-col gap-4 border-r border-[#2E2E2E]/10">
      <nav className="flex flex-col gap-4">
        <Link 
          href="/" 
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#BEF3B8] transition-colors text-[#2E2E2E]"
        >
          <User size={20} />
          <span className="font-medium">Overview</span>
        </Link>
        
        <Link 
          href="/transactions" 
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#BEF3B8] transition-colors text-[#2E2E2E]"
        >
          <ArrowLeftRight size={20} />
          <span className="font-medium">Deposits</span>
        </Link>
        
      </nav>
    </aside>
  );
}
