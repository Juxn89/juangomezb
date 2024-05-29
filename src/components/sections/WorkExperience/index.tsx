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

	return (
		<section id="WorkExperience" className='flex flex-col mt-2 text-white text-xl'>
			<h2>
				<LaptopOutlined className='mr-2'/>
				{ common.WorkExperienceSectionLabel }
			</h2>
		</section>
	)
}
