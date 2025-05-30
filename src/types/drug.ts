import { z } from 'zod';

export const InteractionSeverityEnum = {
  MINOR: 'minor',
  MODERATE: 'moderate',
  MAJOR: 'major',
  CONTRAINDICATED: 'contraindicated'
} as const;

export type InteractionSeverity = typeof InteractionSeverityEnum[keyof typeof InteractionSeverityEnum];

export const DrugSchema = z.object({
  id: z.string(),
  name: z.string(),
  genericName: z.string(),
  brandNames: z.array(z.string()),
  description: z.string(),
  category: z.string(),
  dosageForm: z.array(z.string()),
  contraindications: z.array(z.string()),
  sideEffects: z.array(z.string())
});

export const DrugInteractionSchema = z.object({
  id: z.string(),
  drug1Id: z.string(),
  drug2Id: z.string(),
  severity: z.enum(['minor', 'moderate', 'major', 'contraindicated']),
  description: z.string(),
  recommendation: z.string(),
  mechanismOfAction: z.string().optional(),
  onsetTime: z.string().optional(),
  references: z.array(z.string()).optional()
});

export type Drug = z.infer<typeof DrugSchema>;
export type DrugInteraction = z.infer<typeof DrugInteractionSchema>;

export type SearchResult = {
  drugs: Drug[];
  totalCount: number;
  page: number;
  pageSize: number;
}; 