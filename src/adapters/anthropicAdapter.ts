import Anthropic from '@anthropic-ai/sdk';
import type { AIAdapter, AIGenerationSettings as GenerationSettings, AIDefaultSettings as DefaultSettings, AIModelInfo as ModelInfo } from '../models/aiAdapter';

// Anthropic (Claude) API Adapter
export class AnthropicAdapter implements AIAdapter {
  private client: Anthropic | null = null;
  
  constructor(apiKey?: string) {
    if (apiKey) {
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
      defaultTemperature: 0.7,
      defaultModel: '',
      availableModels: []
    };
  }
  
  /**
   * Gets list of available models from Anthropic API
   */
  async fetchAvailableModels(): Promise<ModelInfo[]> {
    if (!this.client) {
      return [];
    }
    
    try {
      // Define available Claude models
      const claudeModels = [
        { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', maxTokens: 200000 },
        { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', maxTokens: 180000 },
        { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', maxTokens: 150000 },
        { id: 'claude-2.1', name: 'Claude 2.1', maxTokens: 100000 },
        { id: 'claude-2.0', name: 'Claude 2.0', maxTokens: 100000 },
        { id: 'claude-instant-1.2', name: 'Claude Instant 1.2', maxTokens: 100000 },
      ];
      
      // Transform models to ModelInfo format
      return claudeModels.map(model => ({
        id: model.id,
        name: model.name,
        maxTokens: model.maxTokens,
        isDefault: model.id.includes('claude-3-haiku') // Haiku by default as the most accessible
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
        max_tokens: settings?.maxTokens || 1000,
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