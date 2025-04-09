import React, { ReactNode } from 'react';

interface SettingsPanelProps {
  children: ReactNode;
}

export default function SettingsPanel({ children }: SettingsPanelProps) {
  return (
    <div className="settings-container">
      <h3 className="settings-title">Generation Settings</h3>
      {children}
    </div>
  );
} 