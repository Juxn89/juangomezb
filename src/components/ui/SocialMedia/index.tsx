'use client'

import { FC } from 'react'
import Link from 'next/link'
import './SocialMedia.css'
import { ISocialMedia } from '@/translations'

type props = {
	SocialMedialLabels: ISocialMedia[]
}

export const SocialMedia: FC<props> = ({ SocialMedialLabels }) => {
	return (
		<div className="SocialMediaContainer">
			{
				SocialMedialLabels.map( socialMedia => (
					<Link 
						key={socialMedia.title} 
						href={ socialMedia.link } 
						target='_blank'						
						title={ socialMedia.title }
						className='SocialMediaLink'
					>
						<socialMedia.icon
							className="SocialMediaIcon"
							alt={ socialMedia.title }
						/>					
					</Link>
				))
			}
		</div>
	)
}
