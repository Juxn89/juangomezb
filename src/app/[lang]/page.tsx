'use client'
import { Summary, WorkExperience, Skills } from '@/components/sections'
import { useTranslations } from '@/hooks/'

export default function Home() {
	const { 
		Summary: SummaryLabels, 
		SocialMedia: SocialMediaLabels, 
		WorkExperience: WorkExperienceLabels,
		Commons: CommonsLabels
	} = useTranslations()
	
  return (
    <main className="center text-white">
			<Summary SummaryLabels={ SummaryLabels } SocialMediaLabels={ SocialMediaLabels }/>
			<WorkExperience WorkExperienceLabels={ WorkExperienceLabels } CommonsLabels={ CommonsLabels }/>
			<Skills CommonsLabels={ CommonsLabels }/>
    </main>
  )
}
