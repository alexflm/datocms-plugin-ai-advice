import { Advice } from '../models/advice';
import { AIAdapter, AIGenerationSettings as GenerationSettings } from '../models/aiAdapter';
import { AnthropicAdapter } from '../adapters/anthropicAdapter';
import { OpenAiAdapter } from '../adapters/openAiAdapter';

/**
 * Factory for creating artificial intelligence adapters
 * @param advice Advice configuration
 * @returns Adapter for the specified provider
 */
export function createAIAdapter(advice: Advice): AIAdapter {
  switch (advice.apiProvider) {
    case 'anthropic':
      return new AnthropicAdapter(advice.apiKey);
    case 'openai':
      return new OpenAiAdapter(advice.apiKey);
    default:
      throw new Error(`Unsupported API provider: ${advice.apiProvider}`);
  }
}

/**
 * Function to generate advice using all available adapters
 * @param advices List of advice to generate
 * @param prompt Query for generation
 * @param generationSettings Generation settings for each advice
 * @returns Object with generation results for each advice
 */
export async function generateAdviceFromAllProviders(
  advices: Advice[],
  prompt: string,
  generationSettings?: Record<string, GenerationSettings>
): Promise<Record<string, string>> {
  const enabledAdvices = advices.filter(advice => advice.isEnabled);
  const results: Record<string, string> = {};
  
  const promises = enabledAdvices.map(async (advice) => {
    try {
      const adapter = createAIAdapter(advice);
      
      if (adapter.isConfigured()) {
        // Create settings from llmSettings
        const settings: GenerationSettings = {
          model: advice.llmSettings?.model,
          temperature: advice.llmSettings?.temperature,
          maxTokens: advice.llmSettings?.maxTokens
        };
        
        // Override with custom settings if provided
        if (generationSettings?.[advice.id]) {
          Object.assign(settings, generationSettings[advice.id]);
        }
        
        // Apply adviceSettings to the prompt if needed
        let processedPrompt = prompt;
        
        // Example of how to enhance prompt based on adviceSettings
        if (advice.adviceSettings?.imageAnalysis) {
          processedPrompt = `[IMAGE ANALYSIS ENABLED] ${processedPrompt}`;
        }
        
        if (advice.adviceSettings?.imageOptimization) {
          processedPrompt = `[IMAGE OPTIMIZATION ENABLED] ${processedPrompt}`;
        }
        
        if (advice.adviceSettings?.contentEnhancement) {
          processedPrompt = `[CONTENT ENHANCEMENT ENABLED] ${processedPrompt}`;
        }
        
        const response = await adapter.generateAdvice(processedPrompt, settings);
        results[advice.id] = response;
      } else {
        results[advice.id] = 'API key is not configured';
      }
    } catch (error) {
      console.error(`Error generating advice for ${advice.name}:`, error);
      results[advice.id] = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  });
  
  await Promise.all(promises);
  return results;
} 