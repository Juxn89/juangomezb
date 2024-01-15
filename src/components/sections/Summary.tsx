import { FC } from 'react';
import Image from 'next/image'
import { getI18NLabels } from '@/helpers/';

export const Summary: FC = () => {
	const { Summary } = getI18NLabels()

	return(
		<section className='px-10'>
			<picture>
				<Image 
					alt='Profile picture'
					className='rounded-full' 
					height={200}
					src='/assets/img/profile_black_white.png' 
					width={200} 
				/>
			</picture>

			<h1 className='text-2xl'>Juan G&oacute;mez</h1>
			<p className='text-base'>
				{ Summary.description }
			</p>
		</section>
	);
}