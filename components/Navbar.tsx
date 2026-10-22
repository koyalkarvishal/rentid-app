import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-50">
      <Link href="/" className="text-xl font-bold tracking-wide text-blue-400">
        RENT<span className="text-white">ID</span>
      </Link>
      
      <div className="flex items-center gap-6 text-sm font-medium">
        <Link href="/" className="hover:text-blue-400 transition-colors">
          Home
        </Link>
        <Link href="/register" className="hover:text-blue-400 transition-colors">
          Register
        </Link>
        <Link href="/dashboard" className="hover:text-blue-400 transition-colors">
          Privacy Controls
        </Link>
        <Link href="/review" className="hover:text-blue-400 transition-colors">
          Leave Review
        </Link>
      </div>
    </nav>
  );
}