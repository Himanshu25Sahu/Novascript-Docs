"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Code2, Sparkles } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // `highlight` marks the one page that is not documentation — the live
  // interpreter. It gets its own colour so it does not read as another
  // nav item.
  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Docs", href: "/docs" },
    { name: "Phases", href: "/phases" },
    { name: "Examples", href: "/examples" },
    { name: "Playground", href: "/playground", highlight: true },
    { name: "Notes", href: "/notes" },
    { name: "Team", href: "/team" },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-xl font-bold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Code2 className="w-6 h-6" />
            <span>NovaScript</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) =>
              item.highlight ? (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-semibold transition-all ${
                    pathname === item.href
                      ? "border-amber-400/70 bg-amber-400/20 text-amber-200 shadow-[0_0_14px_-2px_rgba(251,191,36,0.45)]"
                      : "border-amber-500/40 bg-amber-500/10 text-amber-300 hover:border-amber-400/70 hover:bg-amber-400/20 hover:text-amber-200 hover:shadow-[0_0_14px_-2px_rgba(251,191,36,0.45)]"
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {item.name}
                </Link>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-2 py-2 text-sm font-medium transition-colors hover:text-blue-400 ${
                    pathname === item.href ? "text-blue-400" : "text-gray-300"
                  }`}
                >
                  {item.name}
                </Link>
              ),
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={
                    item.highlight
                      ? "flex items-center gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-base font-semibold text-amber-300 transition-colors hover:bg-amber-400/20 hover:text-amber-200"
                      : `px-3 py-2 text-base font-medium transition-colors hover:text-blue-400 ${
                          pathname === item.href ? "text-blue-400" : "text-gray-300"
                        }`
                  }
                >
                  {item.highlight && <Sparkles className="h-4 w-4" />}
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
