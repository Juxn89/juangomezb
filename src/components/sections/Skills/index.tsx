'use client'

import { FC } from 'react'
import Image from 'next/image'
import { AppstoreAddOutlined } from '@ant-design/icons'
import { CONST } from '@/helpers'
import { ICommons } from '@/translations'

type SkillsPops = {
	labels: {
		common: ICommons
	}
}

export const Skills: FC<SkillsPops> = ({ labels }) => {
	const { common } = labels
	const { baseURL_skills, skills } = CONST

	return (
		<section id='Skills' className='mt-2 text-white'>
			<h3 className='text-xl font-semibold text-orange-300'>
				<AppstoreAddOutlined className='mr-2'/>
				{ common.SkillsLabel }
			</h3>
			<div className='flex flex-wrap gap-7 w-full mt-2 md:gap-5'>
				{
					skills.map(skill => (
						<Image
							key={ skill.name }
							alt={ skill.title }
							title={ skill.title }
							src={ `${baseURL_skills}${skill.name}.svg` }
							width={ 48 }
							height={ 48 }
							priority
							style={{ width: '48px', height: '48px' }}
						/>
					))
				}
			</div>
		</section>
	)
}
