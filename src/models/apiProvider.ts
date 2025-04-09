export type ApiProviderType = 'anthropic' | 'openai';

export interface ApiProviderConfig {
  name: string;
  type: ApiProviderType;
  apiKey?: string;
}

export const API_PROVIDERS: Record<ApiProviderType, ApiProviderConfig> = {
  anthropic: {
    name: 'Anthropic',
    type: 'anthropic',
  },
  openai: {
    name: 'Open AI',
    type: 'openai',
  }
}; 