import { Button } from "@/components/ui/button"
import { ArrowUpRight, Menu } from "lucide-react"
import Link from "next/link"

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 max-w-full">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-lg md:text-2xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Circle Classroom
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-foreground hover:text-primary transition-colors font-mono text-sm">
            Home
          </Link>
          <Link href="/about" className="text-foreground hover:text-primary transition-colors font-mono text-sm">
            About
          </Link>
          <Link href="/faq" className="text-foreground hover:text-primary transition-colors font-mono text-sm">
            FAQ
          </Link>
          <Link href="/contact" className="text-foreground hover:text-primary transition-colors font-mono text-sm">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <a href="https://liambx.com" target="_blank" rel="noopener noreferrer">
            <Button
              className="bg-primary text-primary-foreground rounded-full px-3 md:px-6 text-xs md:text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{ paddingLeft: "12px", paddingRight: "8px" }}
            >
              <span className="hidden md:inline">Get Started</span>
              <span className="md:hidden">Start</span>
              <ArrowUpRight className="ml-1 h-3 w-3 md:h-4 md:w-4" />
            </Button>
          </a>
          <button className="md:hidden p-2 text-foreground">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
