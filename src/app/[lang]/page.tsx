import { LanguagesType } from "@/common"
import { Header, Summary, WorkExperience } from "@/components/sections"
import { SideNav } from "@/components/ui"
import { PortfolioProvider } from "@/context"
import { useTranslations } from "@/hooks"

type HomeProps = {
	params: { lang: string }
}

export async function generateStaticParams() {
	return [
		{ lang: 'es' },
		{ lang: 'en' }
	]
}

export default function Home(props: HomeProps) {
	const { params } = props
	const { lang } = params

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
