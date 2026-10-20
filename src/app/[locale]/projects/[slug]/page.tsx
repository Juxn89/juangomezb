import type {Metadata} from 'next';
import Image from 'next/image';
import {notFound} from 'next/navigation';
import {headers} from 'next/headers';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {ArrowLeft, CheckCircle2, ExternalLink} from 'lucide-react';
import {Link} from '@/routing';
import {getProjectBySlug, getProjects} from '@/lib/projects/get-projects';
import {generateBreadcrumbSchema, generateProjectSchema, generateSEOMetadata} from '@/lib/utils/seo';
import {Badge} from '@/components/ui/Badge';
import {GithubIcon} from '@/components/ui/GithubIcon';
import {LinkButton} from '@/components/ui/LinkButton';

type Props = {params: Promise<{locale: string; slug: string}>};

export async function generateStaticParams({params}: {params: {locale: string}}) {
	const projects = await getProjects(params.locale);
	return projects.map(({slug}) => ({slug}));
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
	const {locale, slug} = await params;
	const project = await getProjectBySlug(locale, slug);
	if (!project) return {};

	return generateSEOMetadata({
		title: project.title,
		description: project.tagline,
		locale: locale as 'en' | 'es',
		path: `/projects/${project.slug}`,
		type: 'article',
	});
}

function SectionHeading({children}: {children: React.ReactNode}) {
	return <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-6">{children}</h2>;
}

export default async function CaseStudyPage({params}: Props) {
	const {locale, slug} = await params;
	setRequestLocale(locale);

	const [t, project] = await Promise.all([
		getTranslations({locale, namespace: 'projects'}),
		getProjectBySlug(locale, slug),
	]);
	if (!project) notFound();

	const path = `/projects/${project.slug}`;
	const caseStudy = project.caseStudy;
	const nonce = (await headers()).get('x-nonce') || undefined;
	const schemas = [
		generateBreadcrumbSchema([
			{name: t('caseStudy.home'), url: `/${locale}`},
			{name: t('index.title'), url: `/${locale}/projects`},
			{name: project.title, url: `/${locale}${path}`},
		]),
		generateProjectSchema({...project, path, locale: locale as 'en' | 'es'}),
	];

	return (
		<article className="py-12 sm:py-16">
			{schemas.map((schema) => (
				<script
					key={schema['@type']}
					type="application/ld+json"
					nonce={nonce}
					suppressHydrationWarning
					dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}}
				/>
			))}

			<div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
				<nav aria-label={t('caseStudy.breadcrumb')} className="mb-10 text-sm text-text-secondary">
					<ol className="flex flex-wrap items-center gap-2">
						<li>
							<Link href="/" className="hover:text-accent-primary">{t('caseStudy.home')}</Link>
						</li>
						<li aria-hidden="true">/</li>
						<li>
							<Link href="/projects" className="hover:text-accent-primary">{t('index.title')}</Link>
						</li>
						<li aria-hidden="true">/</li>
						<li aria-current="page" className="text-text-primary font-medium break-all">{project.title}</li>
					</ol>
				</nav>

				<header className="mb-12">
					<div className="mb-5 flex flex-wrap items-center gap-2">
						<Badge>{t(`kind.${project.kind}`)}</Badge>
						<Badge variant="success">{t(`status.${project.status}`)}</Badge>
					</div>
					<h1 className="text-4xl sm:text-5xl font-bold gradient-text mb-5 pb-1 leading-tight break-words">
						{project.title}
					</h1>
					<p className="text-xl text-text-primary leading-relaxed mb-4">{project.tagline}</p>
					<p className="text-text-secondary leading-relaxed mb-6">{project.description}</p>

					<dl className="mb-8 flex flex-wrap gap-x-8 gap-y-2 text-sm">
						<div className="flex gap-2">
							<dt className="text-text-secondary">{t('caseStudy.role')}:</dt>
							<dd className="font-medium text-text-primary">{project.role}</dd>
						</div>
						<div className="flex gap-2">
							<dt className="text-text-secondary">{t('caseStudy.year')}:</dt>
							<dd className="font-medium text-text-primary">{project.year}</dd>
						</div>
					</dl>

					<div className="flex flex-wrap gap-3">
						{project.repoUrl && (
							<LinkButton href={project.repoUrl} icon={<GithubIcon className="w-4 h-4" />}>
								{t('viewCode')}
							</LinkButton>
						)}
						{project.demoUrl && (
							<LinkButton href={project.demoUrl} variant="secondary" icon={<ExternalLink className="w-4 h-4" />}>
								{t('viewDemo')}
							</LinkButton>
						)}
					</div>
				</header>

				<dl className="mb-16 grid grid-cols-2 lg:grid-cols-4 gap-4" aria-label={t('metricsLabel')}>
					{project.metrics.map((metric) => (
						<div key={metric.label} className="flex flex-col-reverse justify-end rounded-2xl border border-border bg-bg-secondary p-4">
							<dt className="mt-1 text-sm leading-snug text-text-secondary">{metric.label}</dt>
							<dd className="text-2xl sm:text-3xl font-bold text-accent-primary">{metric.value}</dd>
						</div>
					))}
				</dl>

				{project.video && (
					<section id="demo" className="mb-16 scroll-mt-24" aria-labelledby="demo-heading">
						<h2 id="demo-heading" className="sr-only">{t('caseStudy.video')}</h2>
						<figure>
							<video
								controls
								playsInline
								preload="none"
								poster={project.video.poster}
								width={1280}
								height={720}
								className="w-full h-auto rounded-2xl border border-border bg-black"
							>
								<source src={project.video.src} type="video/mp4" />
							</video>
							<figcaption className="mt-3 text-sm text-text-secondary">{project.video.caption}</figcaption>
						</figure>
					</section>
				)}

				{project.gallery && (
					<section id="gallery" className="mb-16 scroll-mt-24" aria-labelledby="gallery-heading">
						<h2 id="gallery-heading" className="sr-only">{t('caseStudy.gallery')}</h2>
						<div className="grid gap-6 sm:grid-cols-2">
							{project.gallery.map((image) => (
								<figure key={image.src}>
									{/* Each screenshot opens full size: the code in it is small on purpose. */}
									<a
										href={image.src}
										target="_blank"
										rel="noopener noreferrer"
										className="block overflow-hidden rounded-2xl border border-border transition-colors hover:border-accent-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
									>
										<Image
											src={image.src}
											alt={image.alt}
											width={1600}
											height={1000}
											sizes="(min-width: 896px) 416px, (min-width: 640px) 50vw, 100vw"
											className="h-auto w-full"
										/>
									</a>
									<figcaption className="mt-3 text-sm leading-relaxed text-text-secondary">{image.caption}</figcaption>
								</figure>
							))}
						</div>
					</section>
				)}

				{caseStudy && (
					<div className="space-y-16">
						<section>
							<SectionHeading>{t('caseStudy.context')}</SectionHeading>
							<p className="text-lg text-text-secondary leading-relaxed">{caseStudy.context}</p>
						</section>

						<section>
							<SectionHeading>{t('caseStudy.constraints')}</SectionHeading>
							<ul className="space-y-3">
								{caseStudy.constraints.map((constraint) => (
									<li key={constraint} className="flex gap-3 text-text-secondary leading-relaxed">
										<span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-primary" aria-hidden="true" />
										{constraint}
									</li>
								))}
							</ul>
						</section>

						<section>
							<SectionHeading>{t('caseStudy.architecture')}</SectionHeading>
							<ol className="space-y-5">
								{caseStudy.architecture.map((step, i) => (
									<li key={step} className="flex gap-4 text-text-secondary leading-relaxed">
										<span
											className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-primary/10 text-sm font-bold text-accent-primary"
											aria-hidden="true"
										>
											{i + 1}
										</span>
										<span className="pt-1">{step}</span>
									</li>
								))}
							</ol>
						</section>

						<section>
							<SectionHeading>{t('caseStudy.decisions')}</SectionHeading>
							<div className="space-y-5">
								{caseStudy.decisions.map((decision) => (
									<div key={decision.title} className="rounded-2xl border border-border bg-bg-secondary p-6">
										<h3 className="text-lg font-bold text-text-primary mb-2">{decision.title}</h3>
										<p className="text-text-secondary leading-relaxed mb-3">{decision.rationale}</p>
										<p className="text-sm text-text-secondary leading-relaxed border-l-2 border-accent-tertiary pl-3">
											<span className="font-semibold text-text-primary">{t('caseStudy.tradeoff')}: </span>
											{decision.tradeoff}
										</p>
									</div>
								))}
							</div>
						</section>

						<section>
							<SectionHeading>{t('caseStudy.results')}</SectionHeading>
							<ul className="space-y-3">
								{caseStudy.results.map((result) => (
									<li key={result} className="flex gap-3 text-text-secondary leading-relaxed">
										<CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-secondary" aria-hidden="true" />
										{result}
									</li>
								))}
							</ul>
						</section>
					</div>
				)}

				<section className="mt-16">
					<h2 className="sr-only">{t('caseStudy.stack')}</h2>
					<ul className="flex flex-wrap gap-2" aria-label={t('stackLabel')}>
						{project.stack.map((tech) => (
							<li
								key={tech}
								className="rounded-lg bg-bg-secondary px-3 py-1.5 text-xs font-medium text-text-secondary border border-border"
							>
								{tech}
							</li>
						))}
					</ul>
				</section>

				<div className="mt-16 border-t border-border pt-8">
					<Link
						href="/projects"
						className="inline-flex items-center gap-2 font-medium text-accent-primary hover:underline"
					>
						<ArrowLeft className="w-4 h-4" aria-hidden="true" />
						{t('caseStudy.back')}
					</Link>
				</div>
			</div>
		</article>
	);
}
