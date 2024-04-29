import Link from 'next/link'
import './SocialMedia.css'
import { getI18NLabels } from "@/helpers"

export const SocialMedia = () => {
	const { SocialMedia } = getI18NLabels()

	return (
		<div className="SocialMediaContainer">
			{
				SocialMedia.map( socialMedia => (
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
