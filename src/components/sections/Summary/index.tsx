import { FC } from 'react';
import { ProfilePicture, SocialMedia } from '@/components/ui';
import { getI18NLabels } from '@/helpers';
import { AiOutlineEnvironment } from 'react-icons/ai'
import './Summary.css'

export const Summary: FC = () => {

	const { Summary } = getI18NLabels()

	return(
		<section className='summary-container'>
			<div>
				<h1 className='Name'>Hi, I&apos;m <span>Juan G&oacute;mez</span>!</h1>
				<h2 className='Title'>Full Stack Developer</h2>
				<p className='Description'>
					{ Summary.description }					
				</p>
				<span>
					<AiOutlineEnvironment /> { `Managua, Nicaragua` }
				</span>
				<SocialMedia />				
			</div>
			<ProfilePicture />
		</section>
	);
}