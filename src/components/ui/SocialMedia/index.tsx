import Link from 'next/link'
import { MailOutlined } from '@ant-design/icons'
import { getI18NLabels, CONST } from "@/helpers"
import './SocialMedia.css'

export const SocialMedia = () => {
	const { SocialMedia } = getI18NLabels()

	const copyEmailToClipboard = () => {
		navigator.clipboard.writeText('gb.jc@outlook.com')
	}

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
			<MailOutlined 
				className='SocialMediaIcon'
				title={ CONST.email }
				alt={ CONST.email }
				onClick={ copyEmailToClipboard }
			/>
		</div>
	)
}
