export const dynamic = "force-dynamic"

import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Hero } from "@/components/home/Hero"
import { Categories } from "@/components/home/Categories"
import { PopularCourses } from "@/components/home/PopularCourses"
import { HowItWorks } from "@/components/home/HowItWorks"
import { PromoBanner } from "@/components/home/PromoBanner"
import { Instructors } from "@/components/home/Instructors"
import { Testimonials } from "@/components/home/Testimonials"
import { CTA } from "@/components/home/CTA"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Categories />
        <PopularCourses />
        <HowItWorks />
        <PromoBanner />
        <Instructors />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
