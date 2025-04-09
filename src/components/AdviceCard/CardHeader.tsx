import React from 'react';
import { Advice } from '../../models/advice';
import { API_PROVIDERS } from '../../models/apiProvider';

interface CardHeaderProps {
  advice: Advice;
}

export default function CardHeader({ advice }: CardHeaderProps) {
  return (
    <div>
      <h3 style={{ margin: 0 }}>{advice.name}</h3>
      <span style={{ fontSize: '0.9em', color: '#666' }}>
        {API_PROVIDERS[advice.apiProvider].name}
      </span>
    </div>
  );
} 