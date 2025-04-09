import Anthropic from '@anthropic-ai/sdk';
import type { AIAdapter, AIGenerationSettings as GenerationSettings, AIDefaultSettings as DefaultSettings, AIModelInfo as ModelInfo } from '../models/aiAdapter';

// Anthropic (Claude) API Adapter
export class AnthropicAdapter implements AIAdapter {
  private client: Anthropic | null = null;
  private apiKey: string | null = null;
  
  constructor(apiKey?: string) {
    if (apiKey) {
      this.apiKey = apiKey;
      this.client = new Anthropic({ 
        apiKey,
        dangerouslyAllowBrowser: true 
      });
    }
  }
  
  isConfigured(): boolean {
    return this.client !== null;
  }
  
  getDefaultSettings(): DefaultSettings {
    return {
      defaultTemperature: 0.5,
      defaultMaxTokens: 16000
    };
  }
  
  /**
   * Gets list of available models from Anthropic API
   */
  async fetchAvailableModels(): Promise<ModelInfo[]> {
    if (!this.client || !this.apiKey) {
      return [];
    }
    
    try {
      const modelsResponse = await this.client.models.list();
      
      return modelsResponse.data.map((model: any) => ({
        id: model.id,
        name: model.name, 
        maxTokens: model.max_tokens
      }));
    } catch (error) {
      console.error('Error fetching Anthropic models:', error);
      return [];
    }
  }
  
  async generateAdvice(prompt: string, settings?: GenerationSettings): Promise<string> {
    if (!this.client) {
      throw new Error('Anthropic API key is not configured');
    }
    
    if (!settings?.model) {
      throw new Error('Model is not specified');
    }
    
    try {
      const response = await this.client.messages.create({
        model: settings.model,
        max_tokens: settings?.maxTokens || this.getDefaultSettings().defaultMaxTokens,
        temperature: settings?.temperature || this.getDefaultSettings().defaultTemperature,
        messages: [{ role: 'user', content: prompt }],
      });
      
      if (response.content && response.content.length > 0) {
        const firstContent = response.content[0];
        if ('text' in firstContent) {
          return firstContent.text;
        }
      }
      return 'No valid response from Anthropic API';
    } catch (error) {
      console.error('Error with Anthropic API:', error);
      return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }
} 