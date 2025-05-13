"use client"

import Navbar from "@/components/navbar"
import AboutSection from "@/components/about-section"
import RegenerationSection from "@/components/regeneration-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section id="hero" className="py-20 bg-purple-50 w-full flex justify-center items-center">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Image Regeneration Platform</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Transform your images using advanced AI technology with our powerful regeneration tools
          </p>
          <a
            href="#regenerate"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById("regenerate")?.scrollIntoView({ behavior: "smooth" })
            }}
          >
            Get Started
          </a>
        </div>
      </section>
      <main className="flex-1">
        <AboutSection />
        <RegenerationSection />
      </main>
      <Footer />
    </div>
  )
}
