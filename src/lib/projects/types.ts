import type {z} from 'zod';
import type {
	projectCaseStudySchema,
	projectDecisionSchema,
	projectMetricSchema,
	projectSchema,
} from './schema';

export type Project = z.infer<typeof projectSchema>;
export type ProjectKind = Project['kind'];
export type ProjectStatus = Project['status'];
export type ProjectMetric = z.infer<typeof projectMetricSchema>;
export type ProjectDecision = z.infer<typeof projectDecisionSchema>;
export type ProjectCaseStudy = z.infer<typeof projectCaseStudySchema>;
