'use client'

import Image from 'next/image'
import { Navbar, Summary } from '@/components/sections/'

export default function Home() {
  return (
    <main className="center text-white px-2 sm:px-10">
			<Navbar />
			<Summary />
    </main>
  )
}
