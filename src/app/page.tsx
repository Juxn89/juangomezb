'use client'
import { Navbar, Summary, WorkExperience } from '@/components/sections/'

export default function Home() {
  return (
    <main className="center text-white px-2 sm:px-10">
			<Navbar />
			<Summary />
			<WorkExperience />
    </main>
  )
}
