import "./globals.css"
import { Inter } from "next/font/google"
import Navbar from "@/components/Navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "NovaScript — A programming language and interpreter written in C++",
  description:
    "An indentation-sensitive language with a hand-written lexer, recursive-descent parser, scoped symbol table and tree-walking interpreter. Inspect the real token stream, AST and output of every example.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-900 text-gray-100 min-h-screen`}>
        <Navbar />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  )
}
