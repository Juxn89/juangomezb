'use client'

import { FC } from 'react';
import { LANGUAGES } from '@/lang';

export const Languages: FC = () => {
	return(
		<div className="flex justify-end">
			<select id="languages-allowed" className="text-black" title='Language selector'>
				<option value={ LANGUAGES.ENGLISH }>
					<span style={{ backgroundImage: '/assets/svg/flags/us.svg', width: 10, height:10 }}></span>
					<span>English</span>
				</option>
				<option value={ LANGUAGES.ENGLISH } >
					Español
				</option>
			</select>
		</div>
	)
}