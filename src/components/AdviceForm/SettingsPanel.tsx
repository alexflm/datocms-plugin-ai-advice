import React, { ReactNode } from 'react';

interface SettingsPanelProps {
  children: ReactNode;
  title?: string;
}

export default function SettingsPanel({ children, title = "Generation Settings" }: SettingsPanelProps) {
  return (
    <div className="settings-container">
      <h3 className="settings-title">{title}</h3>
      {children}
    </div>
  );
} 