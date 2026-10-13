import {setRequestLocale} from 'next-intl/server';
import {HeroSection} from '@/components/sections/HeroSection';
import {AboutSection} from '@/components/sections/AboutSection';
import {ExperienceSection} from '@/components/sections/ExperienceSection';
import {ProjectsSection} from '@/components/sections/ProjectsSection';
import {BlogSection} from '@/components/sections/BlogSection';

export default async function Home({params}: {params: Promise<{locale: string}>}) {
	const {locale} = await params;
	setRequestLocale(locale);

	return (
		<>
			<HeroSection />
			<AboutSection />
			<ExperienceSection />
			<ProjectsSection />
			<BlogSection />
		</>
	);
}
