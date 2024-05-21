'use client'

import { FC } from 'react'
import Image from 'next/image'
import { CONST } from '@/helpers'
import { ICommons } from '@/translations'
import './Skills.css'

type props = {
	CommonsLabels: ICommons
}

export const Skills: FC<props> = ({ CommonsLabels }) => {

	return (
		<section className='SkillsSection'>
			<h2>{ CommonsLabels.SkillsLabel }</h2>
			<div className='SkillContainer'>
				{
					CONST.skills.map(skill => (
						<Image
							key={ skill.name }
							alt={ skill.name }
							src={ `${CONST.baseURL_skills}${skill.name}.svg` }
							title={ skill.title }
							height={ 48 }
							width={ 48 }
							priority
						/>
					))
				}
			</div>
		</section>
	)
}
