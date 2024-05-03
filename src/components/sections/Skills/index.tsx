import { getI18NLabels } from '@/helpers'
import { CONST } from '@/helpers'
import Image from 'next/image'
import './Skills.css'

export const Skills = () => {
	const { Commons } = getI18NLabels()	

	return (
		<section className='SkillsSection'>
			<h2>{ Commons.SkillsLabel }</h2>
			<div className='SkillContainer'>
				{
					CONST.skills.map(skill => (
						<Image
							key={ skill.name }
							src={ `${CONST.baseURL_skills}${skill.name}.svg` }
							alt={ skill.name }
							title={ skill.title }
							width={ 38 }
							height={ 38 }
						/>
					))
				}
			</div>
		</section>
	)
}
