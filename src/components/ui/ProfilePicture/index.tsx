'use client'

import Image from 'next/image'

export const ProfilePicture = () => {
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
				<div>
					<span>Open to work</span>
				</div>
			</div>
		</>
	)
}
