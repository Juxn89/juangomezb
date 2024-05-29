'use clinte'

import { FC } from 'react'
import { ISocialMedia } from '@/translations'
import { GithubOutlined, LinkedinOutlined, MailOutlined } from '@ant-design/icons'

type SocialMediaProps = {
	labels: ISocialMedia[]
}

export const SocialMedia: FC<SocialMediaProps> = ({ labels }) => {
	const [ LinkedIn, GitHub, Mail ] = labels

	return (
		<nav className="flex text-2xl flex-wrap gap-2 mt-2">
			<a className='w-[45px] h-[45px] p-1' href={ LinkedIn.link } target="_blank" rel="noopener noreferrer" role="link" title={ LinkedIn.title } >
				<LinkedinOutlined className='text-4xl'/>
			</a>
			<a className='w-[45px] h-[45px] p-1' href={ GitHub.link } target="_blank" rel="noopener noreferrer" role="link" title={ GitHub.title } >
				<GithubOutlined className='text-4xl'/>
			</a>
			<a className='w-[45px] h-[45px] p-1' href={ Mail.link } target="_blank" rel="noopener noreferrer" role="link" title={ Mail.title } >
				<MailOutlined className='text-4xl'/>
			</a>
		</nav>
	)
}
