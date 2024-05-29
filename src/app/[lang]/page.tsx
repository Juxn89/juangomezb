'use client'

import { LanguagesType } from "@/common"
import { Header, Summary, WorkExperience } from "@/components/sections"
import { SideNav } from "@/components/ui"
import { PortfolioProvider } from "@/context"
import { useTranslations } from "@/hooks"
import { useParams } from "next/navigation"

export default function Home() {
	const { lang }= useParams()
	const { 
		Commons, 
		SocialMedia, 
		Summary: SummaryLabels, 
		WorkExperience: Experiences 
	} = useTranslations(lang as LanguagesType )

  return (
		<PortfolioProvider>
			<div className="w-full h-full">
				<Header />
				<SideNav />
				<main className="p-2">
					<Summary labels={ SummaryLabels } socialLabels={ SocialMedia } />
					<WorkExperience labels={ { common: Commons, labels: Experiences } } />
				</main>
			</div>			
		</PortfolioProvider>
  )
}
