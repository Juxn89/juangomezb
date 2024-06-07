import { LanguagesType } from '@/common'
import { SideNav } from '@/components/ui'
import { useTranslations } from '@/hooks'
import { PortfolioProvider } from '@/context'
import { Header, Projects, Summary, WorkExperience } from '@/components/sections'

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
		WorkExperience: Experiences,
		Projects: ProjectsLabel
	} = useTranslations(lang as LanguagesType )

  return (
		<PortfolioProvider>
			<div className="w-full h-full">
				<Header />
				<SideNav />
				<main className="p-2">
					<Summary labels={ SummaryLabels } socialLabels={ SocialMedia } />
					<WorkExperience labels={ { common: Commons, labels: Experiences } } />
					<Projects labels={ { common: Commons, projects: ProjectsLabel } }/>
				</main>
			</div>			
		</PortfolioProvider>
  )
}
