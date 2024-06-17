import { LanguagesType } from '@/common'
import { SideNav } from '@/components/ui'
import { useTranslations } from '@/hooks'
import { PortfolioProvider } from '@/context'
import { Header, Projects, Skills, Summary, WorkExperience } from '@/components/sections'

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
		Flag,
		Projects: ProjectsLabel,
		SocialMedia, 
		Summary: SummaryLabels, 
		WorkExperience: Experiences
	} = useTranslations(lang as LanguagesType )

  return (
	<PortfolioProvider>
		<div className="w-full h-full md:px-56">
			<Header
				labels={{ src: Flag.url, title: Flag.title }}
			>
				<Flag.flag className='w-[45px] h-[45px] rounded-lg mr-2' />
			</Header>
			<SideNav />
			<main className="p-2">
				<Summary labels={ SummaryLabels } socialLabels={ SocialMedia } openToWork={ Commons.OpenToWorkLabel }/>
				<WorkExperience labels={ { common: Commons, labels: Experiences } } />
				<Projects labels={ { common: Commons, projects: ProjectsLabel } }/>
				<Skills labels={{ common: Commons }}/>
			</main>
		</div>
	</PortfolioProvider>
  )
}
