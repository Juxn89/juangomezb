import Image from 'next/image'
import './ProfilePicture.css'

export const ProfilePicture = () => {
	return (
		<Image
			src='/assets/img/profile_cv.png'
			alt='Profile picture'
			height={200}
			width={200}
			className='ProfilePicture'
		/>
	)
}
