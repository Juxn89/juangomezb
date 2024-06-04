import { FC } from 'react'
import { ISocialMedia, ISummary } from '@/translations'
import { ProfilePicture, SocialMedia } from '@/components/ui'

type SummaryLabels = {
	labels: ISummary,
	socialLabels: ISocialMedia[]
}
 
 export const Summary: FC<SummaryLabels> = ({ labels, socialLabels }) => {
	const { greeting, yearsOfExperience, grade, description, location } = labels

	return (
		<section id='home' className='text-white'>
			<ProfilePicture />
			<h1 className='text-3xl font-semibold'>{ greeting }</h1>
			<p className='text-lg'>
				{ yearsOfExperience }
				<strong className='text-blue-300'>{ grade }</strong>
				{ location }
				{ description }
			</p>
			<SocialMedia labels={ socialLabels }/>
		</section>
	)
 }