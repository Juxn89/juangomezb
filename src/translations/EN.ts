import { Info } from "@/common";
import { GithubFilled, LinkedinFilled } from "@ant-design/icons";
import { Translation } from "./Translations.interface";
import { CONST } from '@/helpers'

export const EN: Translation = {
	Commons: {
		CurrentLabel: 'Current',
		WorkExperienceSectionLabel: 'Work Experience'
	},
	Flag: {
		title: "Cambiar idioma a Español",
		code: 'ES',
		alt: "Cambiar idioma a Español"
	},
	Summary: {
		greeting: `Hi!, I'm Juan`,
		description:
			`Full Stack developer with ${ Info.yearsOfExperience }+ years of developing and implementing web applications using .NET technologies`
	},
	SocialMedia: [
		{ title: 'GitHub repository', icon: GithubFilled, link: CONST.github },
		{ title: 'LinkedIn profile', icon: LinkedinFilled, link: `${CONST.linkedin}?locale=en_US` },
	],
	WorkExperience: [
		{
			positionName: 'Senior .NET Developer',
			companyName: 'The Stepstone Group',
			startDate: '2022-01',
			isCurrent: true,
			summary: ``,
			tags: [ 'C#', 'AWS', 'React', 'NestJS', 'SQL' ]
		}
	]
}