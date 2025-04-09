import { Advice } from '../models/advice';
import { AIModelInfo as ModelInfo } from '../models/aiAdapter';
import { createAIAdapter } from './aiService';
import { ApiProviderType } from '../models/apiProvider';

// Cache for models by provider and key
interface ModelCache {
  [key: string]: {
    models: ModelInfo[];
    timestamp: number;
  }
}

// Cache lifetime - 10 minutes in milliseconds
const CACHE_TTL = 10 * 60 * 1000;

// Models cache
const modelsCache: ModelCache = {};

/**
 * Returns the default model for the specified API provider
 * @param providerType Type of API provider
 * @returns Identifier of the default model or an empty string
 */
export function getDefaultModelForProvider(providerType: ApiProviderType): string {
  // We no longer use default models
  return '';
}

/**
 * Asynchronously retrieves model lists directly from API providers with caching
 * @param advice Advice configuration with API key
 * @returns Array of model information
 */
export async function fetchModelsFromProvider(advice: Advice): Promise<ModelInfo[]> {
  try {
    // If API key is not configured, return an empty list
    if (!advice.apiKey) {
      return [];
    }
    
    // Create a cache key based on the provider and API key
    const cacheKey = `${advice.apiProvider}_${advice.apiKey}`;
    
    // Check cache
    const cachedData = modelsCache[cacheKey];
    const currentTime = Date.now();
    
    if (cachedData && (currentTime - cachedData.timestamp < CACHE_TTL)) {
      // Return cached data if they are not outdated
      console.log('Returning cached models for', advice.apiProvider);
      return cachedData.models;
    }
    
    // If data is not in cache or it is outdated, make a request
    // Create an adapter for the specified type
    const adapter = createAIAdapter(advice);
    
    // If the adapter is configured (there is an API key), get models through API
    if (adapter.isConfigured()) {
      const models = await adapter.fetchAvailableModels();
      
      // Cache the retrieved models
      modelsCache[cacheKey] = {
        models,
        timestamp: currentTime
      };
      
      return models;
    }
    
    // If API key is not configured, return an empty list
    return [];
  } catch (error) {
    console.error(`Error fetching models for ${advice.apiProvider}:`, error);
    
    // In case of an error, return an empty list
    return [];
  }
} 