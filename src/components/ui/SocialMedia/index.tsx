import { FC } from 'react'
import { ISocialMedia } from '@/translations'

type SocialMediaProps = {
	labels: ISocialMedia[]
}

export const SocialMedia: FC<SocialMediaProps> = ({ labels }) => {
	return (
		<nav className="flex flex-wrap gap-2 mt-2">
			{
				labels.map(socialMedia => {
					console.log({
						style: socialMedia.style,
						isUndefined: socialMedia.style === undefined,
						styleToApply: socialMedia.style === undefined ? 'p-1 bg-yellow-100 text-yellow-800 rounded-2xl text-lg w-40 min-w-40 min-h-9 h-9' : socialMedia.style
					})

					return (
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
								{/* <span>{ socialMedia.label }</span> */}
							</span>
						</a>
					)
				})
			}
		</nav>
	)
}
