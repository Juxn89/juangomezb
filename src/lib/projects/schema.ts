import {z} from 'zod';

/** An absolute https URL, or a path served by this site. Placeholders such as "#" are rejected. */
const linkSchema = z
	.string()
	.refine((value) => value.startsWith('https://') || /^\/[^/]/.test(value), {
		message: 'Expected an https:// URL or a site path starting with /',
	});

const nonEmpty = z.string().trim().min(1);

export const projectMetricSchema = z.object({
	value: nonEmpty,
	label: nonEmpty,
});

export const projectDecisionSchema = z.object({
	title: nonEmpty,
	rationale: nonEmpty,
	tradeoff: nonEmpty,
});

export const projectCaseStudySchema = z.object({
	context: nonEmpty,
	constraints: z.array(nonEmpty).min(1),
	architecture: z.array(nonEmpty).min(1),
	decisions: z.array(projectDecisionSchema).min(1),
	results: z.array(nonEmpty).min(1),
});

export const projectSchema = z.object({
	slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slugs are kebab-case'),
	kind: z.enum(['oss', 'case-study']),
	status: z.enum(['live', 'in-progress', 'archived']),
	featured: z.boolean(),
	year: nonEmpty,
	role: nonEmpty,
	title: nonEmpty,
	tagline: nonEmpty,
	description: nonEmpty,
	metrics: z.array(projectMetricSchema).min(1),
	stack: z.array(nonEmpty).min(1),
	repoUrl: linkSchema.optional(),
	demoUrl: linkSchema.optional(),
	video: z
		.object({
			src: linkSchema,
			poster: linkSchema,
			caption: nonEmpty,
		})
		.optional(),
	// Screenshots of the real product, shown on the case study when there is no video to tell the story.
	gallery: z
		.array(
			z.object({
				src: linkSchema,
				alt: nonEmpty,
				caption: nonEmpty,
			})
		)
		.min(1)
		.optional(),
	caseStudy: projectCaseStudySchema.optional(),
});
