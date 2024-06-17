import { FC } from 'react'
import { ExperimentOutlined } from '@ant-design/icons'
import { ICommons, IProject } from '@/translations'

type ProjectsProps = {
	labels: {
		common: ICommons,
		projects: IProject[]
	}
}

export const Projects: FC<ProjectsProps> = ({ labels }) => {
	const { common, projects } = labels

	return (
		<section id='Projects' className='mt-2 text-white'>
			<h2 className='text-xl font-semibold text-orange-300'>
				<ExperimentOutlined className='mr-2'/> 
				{ common.ProjectsSectionLabel }
			</h2>
			<div>
				
			</div>
		</section>
	)
}
