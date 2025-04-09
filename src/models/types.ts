// Re-export types from aiAdapter.ts for backward compatibility
import { 
  AIGenerationSettings, 
  AIDefaultSettings, 
  AIModelInfo, 
  AIAdapter 
} from './aiAdapter';

export type GenerationSettings = AIGenerationSettings;
export type DefaultSettings = AIDefaultSettings;
export type ModelInfo = AIModelInfo;
export type { AIAdapter }; 