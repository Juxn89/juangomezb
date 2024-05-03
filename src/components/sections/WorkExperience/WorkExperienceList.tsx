import { FC } from 'react'
import { WorkExperienceCard } from './WorkExperienceCard'
import { getI18NLabels } from '@/helpers'
import './WorkExperience.css'

export const WorkExperienceList: FC = () => {
	const { WorkExperience } = getI18NLabels()

	return (
		<>
			{
				WorkExperience.map(workExperience => (
					<WorkExperienceCard 
						key={workExperience.companyName}
						WorkExperience={ workExperience }
					/>
				))
			}
		</>
	)
}
