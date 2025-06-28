
import { z } from 'zod';

export const figmaUrlSchema = z.object({
  url: z
    .string()
    .min(1, 'Figma URL is required')
    .url('Please enter a valid URL')
    .refine(
      (url) => {
        try {
          const urlObj = new URL(url);
          return urlObj.hostname === 'www.figma.com' && 
                 (urlObj.pathname.includes('/file/') || urlObj.pathname.includes('/design/'));
        } catch {
          return false;
        }
      },
      'Please enter a valid Figma file URL'
    )
});

export const apiKeySchema = z.object({
  apiKey: z
    .string()
    .min(1, 'API key is required')
    .min(40, 'API key appears to be too short')
    .regex(/^fig[a-zA-Z0-9_-]+$/, 'Please enter a valid Figma API key (starts with "fig")')
});

export const batchImportSchema = z.object({
  urls: z
    .array(z.string().url())
    .min(1, 'At least one URL is required')
    .max(10, 'Maximum 10 files can be processed at once'),
  apiKey: apiKeySchema.shape.apiKey
});

export const exportConfigSchema = z.object({
  format: z.enum(['json', 'css', 'scss', 'tokens']),
  includeComponents: z.boolean().default(true),
  includeStyles: z.boolean().default(true),
  includeAssets: z.boolean().default(false),
  customPrefix: z.string().optional(),
  outputPath: z.string().optional()
});

export type FigmaUrlFormData = z.infer<typeof figmaUrlSchema>;
export type ApiKeyFormData = z.infer<typeof apiKeySchema>;
export type BatchImportFormData = z.infer<typeof batchImportSchema>;
export type ExportConfigFormData = z.infer<typeof exportConfigSchema>;
