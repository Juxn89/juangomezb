'use client'

import { FC } from 'react';

export const Languages: FC = () => {
	return(
		<div className="flex justify-end">
			<select name="languages-allowed" className="text-black">
				<option value={'EN'} >
					English
				</option>
				<option value={'ES'} >Español</option>
			</select>
		</div>
	)
}