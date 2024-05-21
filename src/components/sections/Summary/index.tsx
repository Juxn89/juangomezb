'use client'

import { FC } from 'react';
import { AiOutlineEnvironment } from 'react-icons/ai'
import { ProfilePicture, SocialMedia } from '@/components/ui';
import { ISummary, ISocialMedia } from '@/translations';
import './Summary.css'

type props = {
	SummaryLabels: ISummary,
	SocialMediaLabels: ISocialMedia[]
}

export const Summary: FC<props> = ({ SummaryLabels, SocialMediaLabels }) => {

	return(
		<section className='summary-container'>
			<div>
				<h1 className='Name'>Hi, I&apos;m <span>Juan G&oacute;mez</span>!</h1>
				<h2 className='Title'>Full Stack Developer</h2>
				<p className='Description'>
					{ SummaryLabels.description }					
				</p>
				<span className='Location'>
					<AiOutlineEnvironment /> { `Managua, Nicaragua` }
				</span>
				<SocialMedia SocialMedialLabels={ SocialMediaLabels }/>
			</div>
			<ProfilePicture />
		</section>
	);
}