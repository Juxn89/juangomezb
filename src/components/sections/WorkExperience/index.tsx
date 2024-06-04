import { FC } from 'react'
import { ICommons, IWorkExperience } from '@/translations'
import { LaptopOutlined } from '@ant-design/icons'

type WorkExperienceProps = {
	labels: {
		common: ICommons,
		labels: IWorkExperience[]
	}
}

export const WorkExperience: FC<WorkExperienceProps> = (props) => {
	const { common, labels } = props.labels
	const workExperiences = labels.splice(0, 3)

	return (
		<section id="WorkExperience" className='flex flex-col mt-2 text-white text-xl'>
			<h2 className='text-xl font-semibold' suppressHydrationWarning>
				<LaptopOutlined className='mr-2'/>
				{ common.WorkExperienceSectionLabel }
			</h2>
			
			<ol className="relative border-s border-gray-200 dark:border-gray-700">
				{
					workExperiences.map(workExperience => (
						<li className="ms-4" key={ workExperience.companyName }>
							<div className="absolute w-3 h-3 bg-yellow-300 rounded-full mt-1.5 -start-1.5 border border-yellow-300"></div>
							<time className="mb-1 text-sm font-normal leading-none text-yellow-300" suppressHydrationWarning>
								{ workExperience.isCurrent ? common.CurrentLabel : workExperience.endDate }
							</time>
							<h3 className="text-lg font-semibold text-blue-300" suppressHydrationWarning>
								{ workExperience.positionName }
							</h3>
							<p className="text-base font-normal text-white" suppressHydrationWarning>
								{ workExperience.summary }
							</p>
						</li>						
					))
				}
			</ol>
		</section>
	)
}
