'use client'

import { FC } from 'react'
import Image from 'next/image'

type ProfilePictureProps = {
	labels: {
		OpentToWork: string
	}
}

export const ProfilePicture: FC<ProfilePictureProps> = ({ labels }) => {
	const { OpentToWork } = labels

	return (
		<>
			<div className="w-full mb-1 flex justify-stretch gap-2 items-center">
				<Image 
					alt='Juan Gómez profile picture'
					src='/assets/img/profile_black_white.png' 
					className='bg-blue-400 rounded-full'
					height={80}
					width={80}
					priority
				/>
				<div 
					className='border-solid border-blue-700 bg-blue-100 text-blue-950 rounded-xl'
				>
					<span className='p-1 font-semibold'>{ OpentToWork }</span>
				</div>
			</div>
		</>
	)
}
