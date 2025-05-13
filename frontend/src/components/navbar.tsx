"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60  w-full flex justify-center items-center">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Image Regeneration</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="#about"
            className="text-sm font-medium transition-colors hover:text-primary"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
            }}
          >
            About
          </Link>
          <Link
            href="#regenerate"
            className="text-sm font-medium transition-colors hover:text-primary"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById("regenerate")?.scrollIntoView({ behavior: "smooth" })
            }}
          >
            Regenerate
          </Link>
          
        </nav>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="container md:hidden py-4 pb-6">
          <nav className="flex flex-col space-y-4">
            <Link
              href="#about"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
                setIsMenuOpen(false)
              }}
            >
              About
            </Link>
            <Link
              href="#regenerate"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById("regenerate")?.scrollIntoView({ behavior: "smooth" })
                setIsMenuOpen(false)
              }}
            >
              Regenerate
            </Link>
            <Button asChild onClick={() => setIsMenuOpen(false)}>
              <Link
                href="#regenerate"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById("regenerate")?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                Try Now
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
