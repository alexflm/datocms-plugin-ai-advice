import React from 'react';
import { AdviceSettings } from '../../models/advice';
import { adviceToggleMetadata } from '../../models/aiAdapter';
import SettingsPanel from './SettingsPanel';

interface AdviceTogglesProps {
  adviceId: string;
  adviceSettings: AdviceSettings;
  onSettingsChange: (settings: AdviceSettings) => void;
}

export default function AdviceToggles({ adviceId, adviceSettings, onSettingsChange }: AdviceTogglesProps) {
  // Ensure adviceSettings exists
  const settings = adviceSettings || {
    imageAnalysis: false,
    imageOptimization: false,
    contentEnhancement: false
  };

  // Handle toggle change
  const handleToggleChange = (toggleKey: string, checked: boolean) => {
    const updatedSettings = {
      ...settings,
      [toggleKey]: checked
    };
    
    onSettingsChange(updatedSettings);
  };

  return (
    <SettingsPanel title="Advanced Features">
      <div className="toggle-group">
        {Object.entries(adviceToggleMetadata).map(([key, metadata]) => (
          <div key={`toggle_${key}_${adviceId}`} className="toggle-item">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings[key as keyof typeof settings] || false}
                onChange={(e) => handleToggleChange(key, e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
            <div className="toggle-content">
              <div className="toggle-title">{metadata.title}</div>
              <div className="toggle-description">{metadata.description}</div>
            </div>
          </div>
        ))}
      </div>
    </SettingsPanel>
  );
} 