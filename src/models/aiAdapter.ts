// Interface for AI generation settings
export interface AIGenerationSettings {
  temperature?: number;   // Generation temperature (determines AI creativity)
  model?: string;         // Neural network model used for generation
  maxTokens?: number;     // Maximum number of tokens for content generation
}

// Metadata for advice toggles with titles and descriptions
export const adviceToggleMetadata = {
  imageAnalysis: {
    title: "Analyzing Images",
    description: "If you will be transmitting the complete model with images or structured text containing images, the system will analyze these visual elements."
  },
  imageOptimization: {
    title: "Optimizing Images",
    description: "Images will be compressed for LLM transmission. All images are optimized using imgix parameters to ensure efficient processing."
  },
  contentEnhancement: {
    title: "Suggesting Improved Content",
    description: "The model will provide you with a new enhanced version of your content with improvements and refinements."
  }
};

// Default settings for each AI provider
export interface AIDefaultSettings {
  defaultTemperature: number;   // Default temperature for creativity balance
  defaultMaxTokens: number;
}

// Detailed information about AI model
export interface AIModelInfo {
  id: string;            // Unique neural network model identifier
  name: string;          // Display name of the AI model
  description?: string;  // Description of model capabilities and specialization
  maxTokens?: number;    // Maximum context window (in tokens)
  contextWindow?: number;
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