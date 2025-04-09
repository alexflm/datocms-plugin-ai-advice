// Interface for AI generation settings
export interface AIGenerationSettings {
  temperature?: number;   // Generation temperature (determines AI creativity)
  model?: string;         // Neural network model used for generation
  maxTokens?: number;     // Maximum number of tokens for content generation
}

// Default settings for each AI provider
export interface AIDefaultSettings {
  defaultTemperature: number;   // Default temperature for creativity balance
  defaultModel: string;         // Default AI model
  availableModels: string[];    // List of available machine learning models
}

// Detailed information about AI model
export interface AIModelInfo {
  id: string;            // Unique neural network model identifier
  name: string;          // Display name of the AI model
  description?: string;  // Description of model capabilities and specialization
  maxTokens?: number;    // Maximum context window (in tokens)
  isDefault?: boolean;   // Whether it's the preferred default model
}

// Interface for unified connection to AI providers
export interface AIAdapter {
  // Checks if the adapter is configured with a valid API key
  isConfigured(): boolean;
  
  // Returns default settings for the AI provider
  getDefaultSettings(): AIDefaultSettings;
  
  // Method to get a list of available AI models from the provider
  fetchAvailableModels(): Promise<AIModelInfo[]>;
  
  // Generate content based on the prompt using the AI model
  generateAdvice(prompt: string, settings?: AIGenerationSettings): Promise<string>;
} 