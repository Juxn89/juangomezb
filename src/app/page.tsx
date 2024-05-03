'use client'
import { Navbar, Projects, Skills, Summary, WorkExperience } from '@/components/sections/'

export default function Home() {
  return (
    <main className="center text-white px-2 sm:px-10">
			<Summary />
			<WorkExperience />
			<Skills />
    </main>
  )
}
