import { Info } from '@/common/index';

export interface Translation {
	Summary: ISummary
}

interface ISummary {	
	greeting: string,
	description: string
}