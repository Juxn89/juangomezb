'use client'

import { FC } from 'react'
import { getI18NLabels } from '@/helpers'
import { IWorkExperience } from '@/translations'
import './WorkExperience.css'

type WorkExperienceProps = {
	WorkExperience: IWorkExperience
}

export const WorkExperienceCard: FC<WorkExperienceProps> = ({ WorkExperience }: WorkExperienceProps) => {
	const { positionName, companyName, summary, startDate, endDate, isCurrent, tags } = WorkExperience
	const { Commons } = getI18NLabels()

	return (
		<div className='WorkExperienceCard'>

			<h3 className='postionName'>{ positionName }</h3>
			<h4 className='companyName'>{ companyName }</h4>
			<p className='workExperiencePeriod'>
				{  
					isCurrent 
						? `${startDate} - ${Commons.CurrentLabel}`
						: `${startDate} - ${endDate}`
				}
			</p>
			<p className='company_summary'>{ summary }</p>
			<div className='tags'>
				{
					tags.map(tag => (
						<span 
							key={`${positionName}_${companyName}_${tag}`}
							className='tag'
						>
							{ tag }
						</span>
					))
				}
			</div>
		</div>
	)
}
