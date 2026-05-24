import {HeroSection} from '@/components/sections/HeroSection';
import dynamic from 'next/dynamic';

// Lazy load below-the-fold sections for better performance
const AboutSection = dynamic(() => import('@/components/sections/AboutSection').then(mod => ({default: mod.AboutSection})), {
	loading: () => <div className="min-h-screen" />,
});

const ExperienceSection = dynamic(() => import('@/components/sections/ExperienceSection').then(mod => ({default: mod.ExperienceSection})), {
	loading: () => <div className="min-h-screen" />,
});

const ProjectsSection = dynamic(() => import('@/components/sections/ProjectsSection').then(mod => ({default: mod.ProjectsSection})), {
	loading: () => <div className="min-h-screen" />,
});

const ContactSection = dynamic(() => import('@/components/sections/ContactSection').then(mod => ({default: mod.ContactSection})), {
	loading: () => <div className="min-h-screen" />,
});

export default function Home() {
	return (
		<>
			<HeroSection />
			<AboutSection />
			<ExperienceSection />
			<ProjectsSection />
			<ContactSection />
		</>
	);
}
