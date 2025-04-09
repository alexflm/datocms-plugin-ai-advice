import OpenAI from 'openai';
import type { AIAdapter, AIGenerationSettings as GenerationSettings, AIDefaultSettings as DefaultSettings, AIModelInfo as ModelInfo } from '../models/aiAdapter';

// OpenAI API Adapter
export class OpenAiAdapter implements AIAdapter {
  private client: OpenAI | null = null;
  
  constructor(apiKey?: string) {
    if (apiKey) {
      this.client = new OpenAI({ 
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
   * Gets the list of available models from the OpenAI API
   */
  async fetchAvailableModels(): Promise<ModelInfo[]> {
    if (!this.client) {
      return [];
    }
    
    try {
      const response = await this.client.models.list();
      const models = response.data
        .filter(model => 
          model.id.includes('gpt') && 
          !model.id.includes('instruct') &&
          !model.id.includes('-vision-')
        )
        .sort((a, b) => b.created - a.created)
        .map(model => ({
          id: model.id,
          name: this.formatModelName(model.id),
          isDefault: false
        }));
      
      return models;
    } catch (error) {
      console.error('Error fetching OpenAI models:', error);
      return [];
    }
  }
  
  private formatModelName(modelId: string): string {
    // Convert model ID to a readable name
    return modelId
      .split('-')
      .map(part => {
        if (part.toLowerCase() === 'gpt') return part.toUpperCase();
        return part.charAt(0).toUpperCase() + part.slice(1);
      })
      .join(' ');
  }
  
  async generateAdvice(prompt: string, settings?: GenerationSettings): Promise<string> {
    if (!this.client) {
      throw new Error('OpenAI API key is not configured');
    }
    
    if (!settings?.model) {
      throw new Error('Model is not specified');
    }
    
    try {
      const response = await this.client.chat.completions.create({
        model: settings.model,
        max_tokens: settings?.maxTokens || 1000,
        temperature: settings?.temperature || this.getDefaultSettings().defaultTemperature,
        messages: [{ role: 'user', content: prompt }],
      });
      
      const message = response.choices[0]?.message;
      if (message && message.content) {
        return message.content;
      }
      
      return 'No valid response from OpenAI API';
    } catch (error) {
      console.error('Error with OpenAI API:', error);
      return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }
} 