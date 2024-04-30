import { FC } from 'react'
import { IWorkExperience } from '@/translations'
import './WorkExperience.css'
import { getI18NLabels } from '@/helpers'

type WorkExperienceProps = {
	WorkExperience: IWorkExperience
}

export const WorkExperienceCard: FC<WorkExperienceProps> = ({ WorkExperience }: WorkExperienceProps) => {
	const { positionName, companyName, summary, startDate, endDate, isCurrent, tags } = WorkExperience
	const { Commons } = getI18NLabels()

	return (
		<>
			<h4 className='postionName'>{ positionName }</h4>
			<h5 className='companyName'>{ companyName }</h5>
			<p className='workExperiencePeriod'>
				{  
					isCurrent 
						? `${startDate} - ${Commons.CurrentLabel}`
						: `${startDate} - ${endDate}`
				}
			</p>
			<p className='company_summary'>{ summary }</p>
			<p className='tags'>
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
			</p>
		</>
	)
}
