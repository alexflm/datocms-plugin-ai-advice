import React from 'react';
import { TextField, Spinner } from 'datocms-react-ui';
import type { AIModelInfo as ModelInfo } from '../../models/aiAdapter';

interface ModelSelectorProps {
  adviceId: string;
  isLoadingModels: boolean;
  availableModels: ModelInfo[];
  modelValue: string;
  modelNotFound: boolean;
  getModelDisplayName: (modelId: string) => string;
  onModelChange: (value: string) => void;
}

export default function ModelSelector({
  adviceId,
  isLoadingModels,
  availableModels,
  modelValue,
  modelNotFound,
  getModelDisplayName,
  onModelChange
}: ModelSelectorProps) {
  return (
    <div className="grid-span-2">
      {isLoadingModels ? (
        <div className="model-loading">
          <Spinner size={16} />
          <span className="model-loading-text">Loading available models...</span>
        </div>
      ) : (
        <TextField
          id={`model_${adviceId}`}
          name={`model_${adviceId}`}
          label="Model"
          value=""
          onChange={() => {}}
          textInputProps={{
            className: 'hidden-input',
          }}
          hint={
            <div className="select-wrapper">
              <select 
                id={`model_select_${adviceId}`}
                className="datocms-select"
                value={modelValue}
                onChange={(e) => onModelChange(e.target.value)}
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
  );
} 