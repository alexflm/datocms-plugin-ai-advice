import React, { useState, useEffect } from 'react';
import { Advice } from '../models/advice';
import AdviceCard from './AdviceCard';
import AdviceForm from './AdviceForm';

interface AdviceItemProps {
  advice: Advice;
  onUpdate: (updatedAdvice: Advice) => void;
  onDelete: (id: string) => void;
  onSave: (advice: Advice) => void;
  onDuplicate?: (advice: Advice) => void;
}

export default function AdviceItem({ advice, onUpdate, onDelete, onSave, onDuplicate }: AdviceItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localAdvice, setLocalAdvice] = useState<Advice>(advice);
  const [isEnabled, setIsEnabled] = useState(advice.isEnabled);

  // Synchronize local state with external state when props change
  useEffect(() => {
    setLocalAdvice(advice);
  }, [advice]);

  useEffect(() => {
    // Synchronize local state with external state when props change
    setIsEnabled(advice.isEnabled);
  }, [advice.isEnabled]);

  const handleFieldChange = <K extends keyof Advice>(field: K, value: Advice[K]) => {
    setLocalAdvice(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleToggleEnabled = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    
    const updatedAdvice = {
      ...advice,
      isEnabled: newValue
    };
    
    onUpdate(updatedAdvice); // Immediately save the enable/disable state change
  };

  const handleSave = () => {
    onSave(localAdvice);
  };

  const handleDelete = () => {
    onDelete(advice.id);
  };

  const handleDuplicate = () => {
    if (onDuplicate) {
      onDuplicate(advice);
    }
  };

  return (
    <div style={{ 
      border: '1px solid #e0e0e0', 
      borderRadius: '4px',
      backgroundColor: '#f9f9f9',
      marginBottom: '16px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
    }}>
      <div style={{ 
        padding: isExpanded ? '16px 16px 0 16px' : '16px' 
      }}>
        <AdviceCard 
          advice={localAdvice} 
          isExpanded={isExpanded}
          onToggleExpand={() => setIsExpanded(!isExpanded)}
          onToggleEnabled={handleToggleEnabled}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          bordered={false}
        />
      </div>
      
      {isExpanded && (
        <div style={{ 
          padding: '0 16px 16px 16px',
          borderTop: '1px solid #e0e0e0',
          marginTop: '20px'
        }}>
          <AdviceForm 
            advice={localAdvice}
            onFieldChange={handleFieldChange}
            onDelete={handleDelete}
            onSave={() => handleSave()}
          />
        </div>
      )}
    </div>
  );
} 