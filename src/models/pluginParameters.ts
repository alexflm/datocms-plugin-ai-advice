import { ApiProviderType } from './apiProvider';
import { Advice, createDefaultAdvice, adviceSchema } from './advice';
import { z } from 'zod';

export interface PluginParameters {
  advices: Advice[];
}

export const DEFAULT_PARAMETERS: PluginParameters = {
  advices: [createDefaultAdvice()]
};

export function getPluginParameters(parameters: Record<string, any> | null): PluginParameters {
  if (!parameters) {
    return { ...DEFAULT_PARAMETERS };
  }

  // If parameters are in old format (before adding advice list)
  if (parameters.apiProvider && !parameters.advices) {
    const legacyAdvice: Advice = {
      id: `advice_${Date.now()}`,
      name: 'Imported Advice',
      apiProvider: parameters.apiProvider as ApiProviderType,
      apiKey: parameters.apiKey,
      isEnabled: true
    };
    
    return {
      advices: [legacyAdvice]
    };
  }

  return {
    ...DEFAULT_PARAMETERS,
    ...parameters,
    // Allow empty list of advices
    advices: parameters.advices ?? DEFAULT_PARAMETERS.advices
  };
}

export const pluginParametersSchema = z.object({
  advices: z.array(adviceSchema).default([]),
}); 