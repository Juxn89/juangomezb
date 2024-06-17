import { FC } from 'react'
import { ISocialMedia } from '@/translations'

type SocialMediaProps = {
	labels: ISocialMedia[]
}

export const SocialMedia: FC<SocialMediaProps> = ({ labels }) => {
	return (
		<nav className="flex flex-wrap gap-2 mt-2">
			{
				labels.map(socialMedia => (
					<a
						key={ socialMedia.title }
						className='text-blue-300 w-12 h-12 min-w-12 min-h-12 text-4xl' 
						href={ socialMedia.link } 
						target='_blank' 
						rel='noopener noreferrer' 
						role='link' 
						title={ socialMedia.title }
						download={ socialMedia.download }
					>
						<span className='flex gap-1 justify-start'>
							<socialMedia.icon className='mr-1'/>
						</span>
					</a>
				))
			}
		</nav>
	)
}
