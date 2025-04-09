import React from 'react';
import { Button } from 'datocms-react-ui';

interface FormActionsProps {
  saveStatus: 'initial' | 'saving' | 'saved';
  isLoadingModels: boolean;
  onSave: () => void;
  isButtonDisabled?: boolean;
}

export default function FormActions({ 
  saveStatus, 
  isLoadingModels, 
  onSave,
  isButtonDisabled = false
}: FormActionsProps) {
  return (
    <div className="field-container" style={{ marginTop: '30px' }}>
      {saveStatus === 'initial' && (
        <Button 
          type="button" 
          buttonType="primary" 
          buttonSize="s"
          onClick={onSave}
          disabled={isLoadingModels || isButtonDisabled}
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
          onClick={onSave}
          className="action-button"
          style={{ width: '100%' }}
        >
          Saved!
        </Button>
      )}
    </div>
  );
} 