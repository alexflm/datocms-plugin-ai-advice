import { ApiProviderType } from './apiProvider';
import { z } from 'zod';

// Generation settings for AI advice
export interface AdviceGenerationSettings {
  temperature?: number;  // Generation temperature (determines AI creativity)
  model?: string;        // Neural network model for generation
  maxTokens?: number;    // Maximum number of tokens for content generation
}

export interface Advice {
  id: string;
  name: string;
  apiProvider: ApiProviderType;
  apiKey?: string;
  isEnabled: boolean;
  settings?: AdviceGenerationSettings;
}

export interface AdvicesList {
  advices: Advice[];
}

export function createDefaultAdvice(): Advice {
  return {
    id: `advice_${Date.now()}`,
    name: 'Default Advice',
    apiProvider: 'openai',
    isEnabled: true,
    settings: {
      temperature: 0.5,
      maxTokens: 160000
    }
  };
}

export const adviceGenerationSettingsSchema = z.object({
  temperature: z.number().optional(),
  model: z.string().optional(),
  maxTokens: z.number().optional()
});

export const adviceSchema = z.object({
  id: z.string(),
  name: z.string(),
  apiProvider: z.string(),
  apiKey: z.string().optional(),
  isEnabled: z.boolean(),
  settings: adviceGenerationSettingsSchema.optional()
}); 