import { getI18NLabels } from '@/helpers'
import './WorkExperience.css'
import { WorkExperienceList } from './WorkExperienceList'

export const WorkExperience = () => {

	const { Commons } = getI18NLabels()

	return (
		<section className='WorkExperienceSection'>
			<h2>{ Commons.WorkExperienceSectionLabel }</h2>
			<WorkExperienceList />
		</section>
	)
}
