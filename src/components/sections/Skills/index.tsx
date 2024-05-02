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
							key={ skill }
							src={ `${CONST.baseURL_skills}${skill}.svg` }
							alt={ skill }
							width={ 80}
							height={ 80 }
						/>
					))
				}
			</div>
		</section>
	)
}
