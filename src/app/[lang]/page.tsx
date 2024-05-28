'use client'

import { LanguagesType } from "@/common"
import { Header, About } from "@/components/sections"
import { SideNav } from "@/components/ui"
import { PortfolioProvider } from "@/context"
import { useTranslations } from "@/hooks"
import { useParams } from "next/navigation"

export default function Home() {
	const { lang }= useParams()
	const { Commons, About: AboutLabels } = useTranslations(lang as LanguagesType )

  return (
		<PortfolioProvider>
			<div className="w-full h-full">
				<Header />
				<SideNav />
				<main>
					<About />
				</main>
			</div>			
		</PortfolioProvider>
  )
}
