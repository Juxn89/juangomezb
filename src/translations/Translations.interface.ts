import { IconType } from 'react-icons';
import { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';

export interface Translation {
	Flag: IFlag,
	Summary: ISummary
	SocialMedia: ISocialMedia[]
}

interface ISummary {	
	greeting: string,
	description: string
}

interface IFlag {
	title: string,
	code: 'ES' | 'US'
	alt: string
}

interface ISocialMedia {
	icon: React.ForwardRefExoticComponent<Omit<AntdIconProps, "ref"> & React.RefAttributes<HTMLSpanElement>>,
	link: string,
	title: string,
}