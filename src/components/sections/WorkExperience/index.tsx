'use client'

import { FC } from 'react';
import { WorkExperienceList } from './WorkExperienceList'
import { IWorkExperience, ICommons } from '@/translations';
import './WorkExperience.css'

type props = {
	CommonsLabels: ICommons
	WorkExperienceLabels: IWorkExperience[],
}

export const WorkExperience: FC<props> = ({ WorkExperienceLabels, CommonsLabels }) => {
	return (
		<section className='WorkExperienceSection'>
			<h2>{ CommonsLabels.WorkExperienceSectionLabel }</h2>
			<div className='WorkExperienceContainer'>
				<WorkExperienceList WorkExperiencesLabels={ WorkExperienceLabels }/>
			</div>
		</section>
	)
}
