import { ApiProviderType } from './apiProvider';
import { z } from 'zod';

// Generation settings for AI advice
export interface LLMGenerationSettings {
  temperature?: number;  // Generation temperature (determines AI creativity)
  model?: string;        // Neural network model for generation
  maxTokens?: number;    // Maximum number of tokens for content generation
}

// Settings for advice generation with toggles
export interface AdviceSettings {
  imageAnalysis?: boolean;      // Analyze images in the content
  imageOptimization?: boolean;  // Optimize images for LLM transmission
  contentEnhancement?: boolean; // Suggest improved content with refinements
}

export interface Advice {
  id: string;
  name: string;
  apiProvider: ApiProviderType;
  apiKey?: string;
  isEnabled: boolean;
  llmSettings?: LLMGenerationSettings;
  adviceSettings?: AdviceSettings;
  lastUpdated?: number;  // Timestamp of the last update
  createdAt: number;     // Timestamp of creation
  
  // Markdown fields for AI advice
  contextPrompt: string;     // General description of role and task *
  requirementsPrompt: string; // List of evaluation criteria *
  examplesPrompt?: string;    // Examples of queries and responses
  resultFormatPrompt: string; // Expected response structure *
}

export interface AdvicesList {
  advices: Advice[];
}

export function createDefaultAdvice(): Advice {
  const now = Date.now();
  return {
    id: `advice_${now}`,
    name: 'Default Advice',
    apiProvider: 'openai',
    isEnabled: true,
    llmSettings: {
      temperature: 0.5,
      maxTokens: 16000
    },
    adviceSettings: {
      imageAnalysis: true,
      imageOptimization: true,
      contentEnhancement: true
    },
    lastUpdated: now,
    createdAt: now,
    
    // Default values for markdown fields
    contextPrompt: '',
    requirementsPrompt: '',
    examplesPrompt: '',
    resultFormatPrompt: ''
  };
}

export const llmGenerationSettingsSchema = z.object({
  temperature: z.number().optional(),
  model: z.string().optional(),
  maxTokens: z.number().optional()
});

export const adviceSettingsSchema = z.object({
  imageAnalysis: z.boolean().optional(),
  imageOptimization: z.boolean().optional(),
  contentEnhancement: z.boolean().optional()
});

export const adviceSchema = z.object({
  id: z.string(),
  name: z.string(),
  apiProvider: z.string(),
  apiKey: z.string().optional(),
  isEnabled: z.boolean(),
  llmSettings: llmGenerationSettingsSchema.optional(),
  adviceSettings: adviceSettingsSchema.optional(),
  lastUpdated: z.number().optional(),
  createdAt: z.number(),
  
  // Schema for markdown fields
  contextPrompt: z.string().min(1, "Context Prompt cannot be empty"),
  requirementsPrompt: z.string().min(1, "Requirements cannot be empty"),
  examplesPrompt: z.string().optional(),
  resultFormatPrompt: z.string().min(1, "Result Format cannot be empty")
}); 