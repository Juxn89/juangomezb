'use client'

import { FC } from 'react'
import { WorkExperienceCard } from './WorkExperienceCard'
import './WorkExperience.css'
import { IWorkExperience } from '@/translations';

type props = {
	WorkExperiencesLabels: IWorkExperience[]
}

export const WorkExperienceList: FC<props> = ({ WorkExperiencesLabels }) => {

	return (
		<>
			{
				WorkExperiencesLabels.slice(0,3).map(workExperience => (
					<WorkExperienceCard 
						key={workExperience.companyName}
						WorkExperience={ workExperience }
					/>
				))
			}
		</>
	)
}
