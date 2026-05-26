import {HeroSection} from '@/components/sections/HeroSection';
import {AboutSection} from '@/components/sections/AboutSection';
import {ExperienceSection} from '@/components/sections/ExperienceSection';
import {ProjectsSection} from '@/components/sections/ProjectsSection';
import {BlogSection} from '@/components/sections/BlogSection';
import {ContactSection} from '@/components/sections/ContactSection';

export default function Home() {
	return (
		<>
			<HeroSection />
			<AboutSection />
			<ExperienceSection />
			<ProjectsSection />
			<BlogSection />
			<ContactSection />
		</>
	);
}
