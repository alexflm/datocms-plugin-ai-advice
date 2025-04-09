import React, { useEffect, useState } from 'react';
import { Button, TextField, FieldGroup, Spinner } from 'datocms-react-ui';
import { ApiProviderType, API_PROVIDERS } from '../models/apiProvider';
import { Advice, AdviceGenerationSettings } from '../models/advice';
import { 
  fetchModelsFromProvider
} from '../services/aiModelService';
import type { AIModelInfo as ModelInfo } from '../models/aiAdapter';

// Helper functions for working with models

// We no longer use predefined models
function getModelsByProvider(providerType: ApiProviderType): string[] {
  return [];
}

function getModelDisplayName(modelId: string): string {
  // Convert model ID to a readable name
  return modelId
    .split('-')
    .map(part => {
      if (part.toLowerCase() === 'gpt') return part.toUpperCase();
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(' ');
}

interface AdviceFormProps {
  advice: Advice;
  onFieldChange: <K extends keyof Advice>(field: K, value: Advice[K]) => void;
  onDelete: (id: string) => void;
  onSave: (id: string) => void;
}

export default function AdviceForm({ advice, onFieldChange, onDelete, onSave }: AdviceFormProps) {
  // Local state for settings
  const [settings, setSettings] = useState<AdviceGenerationSettings>(
    advice.settings || { temperature: 0.7 }
  );
  
  // State for models
  const [availableModels, setAvailableModels] = useState<ModelInfo[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState<boolean>(false);
  // Add state for tracking non-existent model
  const [modelNotFound, setModelNotFound] = useState<boolean>(false);
  
  // State for API key validation
  const [isApiKeyValid, setIsApiKeyValid] = useState<boolean | null>(null);
  const [apiKeyMessage, setApiKeyMessage] = useState<string>('');
  
  // State for saving
  const [saveStatus, setSaveStatus] = useState<'initial' | 'saving' | 'saved'>('initial');
  
  // Load models from API if key exists
  useEffect(() => {
    async function loadModels() {
      // Reset API key validation status
      setIsApiKeyValid(null);
      setApiKeyMessage('');
      
      // If API key is set for provider, load models from API
      if (advice.apiKey) {
        setIsLoadingModels(true);
        setModelNotFound(false); // Reset model error state on load
        try {
          const models = await fetchModelsFromProvider(advice);
          setAvailableModels(models);
          
          // Mark API key as valid ONLY if models were found
          if (models.length > 0) {
            setIsApiKeyValid(true);
            setApiKeyMessage(`API key verified successfully. Found ${models.length} model${models.length !== 1 ? 's' : ''}.`);
            
            // If models loaded successfully
            // If model already exists in settings and is in the list of available models, use it
            const existingModel = advice.settings?.model;
            if (existingModel && models.some(m => m.id === existingModel)) {
              setSettings(prev => ({
                ...prev,
                model: existingModel
              }));
            } else if (existingModel) {
              // If model exists but not found in the list of available models
              setModelNotFound(true);
              // Set default model or first from the list
              const defaultModel = models.find((m: ModelInfo) => m.isDefault)?.id || models[0].id;
              setSettings(prev => ({
                ...prev,
                model: defaultModel
              }));
            } else {
              // If no model selected, use default model
              const defaultModel = models.find((m: ModelInfo) => m.isDefault)?.id || models[0].id;
              setSettings(prev => ({
                ...prev,
                model: defaultModel
              }));
            }
          } else {
            // Empty models array means the API key is likely invalid
            setIsApiKeyValid(false);
            setApiKeyMessage('API request failed. No models found. Please check your API key.');
            setSettings(prev => ({
              ...prev,
              model: ''
            }));
          }
        } catch (error) {
          console.error('Error loading models:', error);
          // Mark API key as invalid and show error message
          setIsApiKeyValid(false);
          setApiKeyMessage('API request failed. Please check your API key.');
          // In case of error, use predefined models
          loadFallbackModels();
        } finally {
          setIsLoadingModels(false);
        }
      } else {
        // If API key is not set, use predefined models
        loadFallbackModels();
      }
    }
    
    // Function to load predefined models
    function loadFallbackModels() {
      // We no longer use predefined models
      setAvailableModels([]);
      setSettings(prev => ({
        ...prev,
        model: ''
      }));
    }
    
    loadModels();
  }, [advice.apiProvider, advice.apiKey]);
  
  // Update settings in parent component when they change
  useEffect(() => {
    if (settings) {
      onFieldChange('settings', settings);
    }
  }, [settings, onFieldChange, advice.id]);
  
  // Dynamic style for focus and unification of margins
  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .datocms-select:focus {
        border-color: #4c9aff !important;
        box-shadow: 0 0 0 2px rgba(76,154,255,.3) !important;
      }
      .hidden-input {
        display: none !important;
      }
      .select-wrapper {
        margin-top: 5px;
      }
      .datocms-field-label {
        margin-bottom: 5px !important;
      }
      .datocms-field > div {
        margin-bottom: 5px !important;
      }
      .field-container {
        margin-bottom: 20px;
      }
      .action-button {
        min-width: 100px;
      }
      .muted-text {
        color: #666 !important;
      }
      .settings-container {
        margin-top: 20px;
        padding: 15px;
        background-color: #f9f9f9;
        border-radius: 4px;
        border: 1px dashed #e0e0e0;
      }
      .settings-title {
        margin-top: 0;
        margin-bottom: 15px;
        font-size: 14px;
        color: #666;
      }
      .settings-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
      }
      .grid-span-2 {
        grid-column: span 2;
      }
      .model-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 40px;
      }
      .model-loading-text {
        margin-left: 8px;
        font-size: 13px;
        color: #666;
      }
      .save-loading {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .spinner {
        display: inline-block;
        width: 12px;
        height: 12px;
        margin-right: 6px;
        border: 2px solid rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        border-top-color: #333;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
      .datocms-field-error {
        color: #e34850 !important;
        font-weight: 500 !important;
        margin-top: 5px !important;
        font-size: 13px !important;
        animation: fadeIn 0.3s ease-in-out;
      }
      .muted-button {
        width: 100%;
        padding: 6px 12px;
        background-color: #f0f0f0;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        font-size: 14px;
        text-align: center;
        color: #666;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Handler for settings change
  const handleSettingsChange = (field: keyof AdviceGenerationSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  // Check before saving
  const handleSave = () => {
    // Check for API key
    if (!advice.apiKey) {
      alert('Please enter an API key before saving');
      return;
    }
    
    // Check if API key is valid (models loaded)
    if (advice.apiKey && !isLoadingModels && availableModels.length === 0) {
      alert('Your API key is invalid or models failed to load. Please check your key and try again.');
      return;
    }
    
    // Check for selected model - this is a required field
    if (!settings.model || settings.model === '') {
      alert('Please select a model before saving');
      return;
    }
    
    // Check if selected model exists in the list of available models
    if (modelNotFound) {
      alert('Saved model is not available. Please select a model from the list before saving');
      return;
    }
    
    // Ensure model is set in settings before saving
    if (settings.model) {
      // Check if settings are correctly saved in advice
      if (!advice.settings || advice.settings.model !== settings.model) {
        const updatedSettings = { ...settings };
        onFieldChange('settings', updatedSettings);
      }
    }
    
    // Show saving status
    setSaveStatus('saving');
    
    // Small delay for animation
    setTimeout(() => {
      // Call saving function
      onSave(advice.id);
      
      // Change status to "saved"
      setSaveStatus('saved');
      
      // Reset to initial state after 2 seconds
      setTimeout(() => {
        setSaveStatus('initial');
      }, 2000);
    }, 500);
  };
  
  // Confirm deletion - use standard browser dialog
  /* Unused function
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the advice "${advice.name}"?`)) {
      onDelete(advice.id);
    }
  };
  */

  return (
    <FieldGroup>
      <div className="field-container" style={{ paddingTop: '16px' }}>
        <TextField
          id={`name_${advice.id}`}
          name={`name_${advice.id}`}
          label="Name"
          value={advice.name}
          onChange={(newValue) => onFieldChange('name', newValue)}
        />
      </div>
      
      {/* API Provider field styled as TextField */}
      <div className="field-container">
        <TextField
          id={`provider_${advice.id}`}
          name={`provider_${advice.id}`}
          label="API Provider"
          value=""
          onChange={() => {}}
          textInputProps={{
            className: 'hidden-input',
          }}
          hint={
            <div className="select-wrapper">
              <select 
                id={`provider_select_${advice.id}`}
                className="datocms-select"
                value={advice.apiProvider}
                onChange={(e) => onFieldChange('apiProvider', e.target.value as ApiProviderType)}
                style={{ 
                  width: '100%', 
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  boxSizing: 'border-box',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 10px center',
                  backgroundSize: '10px',
                  paddingRight: '30px',
                  outline: 'none',
                  color: '#333'
                }}
              >
                {Object.entries(API_PROVIDERS).map(([key, provider]) => (
                  <option key={key} value={key}>
                    {provider.name}
                  </option>
                ))}
              </select>
            </div>
          }
        />
      </div>
      
      <div className="field-container">
        <TextField
          id={`apiKey_${advice.id}`}
          name={`apiKey_${advice.id}`}
          label="API Key"
          value={advice.apiKey || ''}
          onChange={(newValue) => onFieldChange('apiKey', newValue)}
          placeholder={`Enter API key for ${API_PROVIDERS[advice.apiProvider].name}`}
          error={isApiKeyValid === false ? apiKeyMessage : undefined}
        />
        {isApiKeyValid === true && advice.apiKey && (
          <div style={{ 
            marginTop: '5px', 
            fontSize: '13px', 
            color: '#00aa55',
            animation: 'fadeIn 0.3s ease-in-out' 
          }}>
            {apiKeyMessage}
          </div>
        )}
        {isLoadingModels && advice.apiKey && (
          <div style={{ 
            marginTop: '5px', 
            fontSize: '13px', 
            color: '#666',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Spinner size={12} style={{ marginRight: '8px' }} />
            Validating API key...
          </div>
        )}
      </div>
      
      {/* Generation Settings section */}
      {advice.apiKey ? (
        <div className="settings-container">
          <h3 className="settings-title">Generation Settings</h3>
          <div className="settings-grid">
            {/* Model selector */}
            <div className="grid-span-2">
              {isLoadingModels ? (
                <div className="model-loading">
                  <Spinner size={16} />
                  <span className="model-loading-text">Loading available models...</span>
                </div>
              ) : (
                <TextField
                  id={`model_${advice.id}`}
                  name={`model_${advice.id}`}
                  label="Model"
                  value=""
                  onChange={() => {}}
                  textInputProps={{
                    className: 'hidden-input',
                  }}
                  hint={
                    <div className="select-wrapper">
                      <select 
                        id={`model_select_${advice.id}`}
                        className="datocms-select"
                        value={settings.model || ''}
                        onChange={(e) => handleSettingsChange('model', e.target.value)}
                        style={{ 
                          width: '100%', 
                          padding: '10px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px',
                          backgroundColor: 'white',
                          boxSizing: 'border-box',
                          appearance: 'none',
                          backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 10px center',
                          backgroundSize: '10px',
                          paddingRight: '30px',
                          outline: 'none',
                          color: '#333'
                        }}
                        disabled={availableModels.length === 0}
                      >
                        <option value="" disabled>Select a model</option>
                        {availableModels.map((model) => (
                          <option key={model.id} value={model.id}>
                            {model.name || getModelDisplayName(model.id)}
                          </option>
                        ))}
                      </select>
                    </div>
                  }
                  error={modelNotFound ? "Previously saved model is not available. Please select a new model." : undefined}
                />
              )}
            </div>
            
            {/* Temperature control */}
            <div>
              <TextField
                id={`temperature_${advice.id}`}
                name={`temperature_${advice.id}`}
                label="Temperature"
                value={String(settings.temperature || 0.7)}
                onChange={(newValue) => 
                  handleSettingsChange('temperature', parseFloat(newValue) || 0.7)
                }
                placeholder="0.7"
                textInputProps={{
                  type: 'number',
                  min: '0',
                  max: '1',
                  step: '0.1',
                }}
                hint="Controls randomness: 0 is deterministic, 1 is creative"
              />
            </div>
            
            {/* Max Tokens control */}
            <div>
              <TextField
                id={`maxTokens_${advice.id}`}
                name={`maxTokens_${advice.id}`}
                label="Max Tokens"
                value={String(settings.maxTokens || 16000)}
                onChange={(newValue) => 
                  handleSettingsChange('maxTokens', parseInt(newValue) || 16000)
                }
                placeholder="16000"
                textInputProps={{
                  type: 'number',
                  min: '100',
                }}
                hint="Maximum length of generated text"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="field-container muted-text" style={{ textAlign: 'center', padding: '15px', border: '1px dashed #e0e0e0', borderRadius: '4px' }}>
          Enter API key to configure generation settings
        </div>
      )}
      
      {/* Save button */}
      <div className="field-container" style={{ marginTop: '30px' }}>
        {saveStatus === 'initial' && (
          <Button 
            type="button" 
            buttonType="primary" 
            buttonSize="s"
            onClick={handleSave}
            disabled={isLoadingModels}
            className="action-button"
            style={{ width: '100%' }}
          >
            Save
          </Button>
        )}
        
        {saveStatus === 'saving' && (
          <Button 
            type="button" 
            buttonType="muted" 
            buttonSize="s"
            disabled={true}
            className="action-button"
            style={{ width: '100%' }}
          >
            <span className="save-loading">
              <span className="spinner"></span>
              Saving...
            </span>
          </Button>
        )}
        
        {saveStatus === 'saved' && (
          <Button 
            type="button" 
            buttonType="muted" 
            buttonSize="s"
            onClick={handleSave}
            className="action-button"
            style={{ width: '100%' }}
          >
            Saved!
          </Button>
        )}
      </div>
      
    </FieldGroup>
  );
}