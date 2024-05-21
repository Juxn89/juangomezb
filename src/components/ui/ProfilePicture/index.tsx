'use client'

import Image from 'next/image'
import './ProfilePicture.css'

export const ProfilePicture = () => {
	return (
		<Image
			src='/assets/img/profile_black_white.png'
			alt='Profile picture'
			height={200}
			width={200}
			className='ProfilePicture'
			priority
		/>
	)
}
