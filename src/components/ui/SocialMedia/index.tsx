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
						className={ `${ !socialMedia.style ? 'p-1 bg-yellow-100 text-yellow-800 rounded-2xl text-lg w-40' : socialMedia.style}` } 
						href={ socialMedia.link } 
						target="_blank" 
						rel="noopener noreferrer" 
						role="link" 
						title={ socialMedia.title }
					>
						<socialMedia.icon className='mr-2'/>
						<span>{ socialMedia.label }</span>
					</a>
				))
			}
		</nav>
	)
}
