import React from 'react';
import { TextField, Spinner } from 'datocms-react-ui';
import { Advice } from '../../models/advice';
import { API_PROVIDERS } from '../../models/apiProvider';

interface ApiKeySectionProps {
  advice: Advice;
  isApiKeyValid: boolean | null;
  apiKeyMessage: string;
  isLoadingModels: boolean;
  onApiKeyChange: (newValue: string) => void;
}

export default function ApiKeySection({ 
  advice, 
  isApiKeyValid, 
  apiKeyMessage, 
  isLoadingModels, 
  onApiKeyChange 
}: ApiKeySectionProps) {
  return (
    <div className="field-container">
      <TextField
        id={`apiKey_${advice.id}`}
        name={`apiKey_${advice.id}`}
        label="API Key"
        value={advice.apiKey || ''}
        onChange={onApiKeyChange}
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
  );
} 