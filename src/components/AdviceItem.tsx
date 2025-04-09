import { useState, useEffect, useRef } from 'react';
import { Advice } from '../models/advice';
import AdviceCard from './AdviceCard';
import AdviceForm from './AdviceForm';
import '../styles/AdviceCard.css';

interface AdviceItemProps {
  advice: Advice;
  onUpdate: (updatedAdvice: Advice) => void;
  onDelete: (id: string) => void;
  onSave: (advice: Advice) => void;
  onDuplicate?: (advice: Advice) => void;
  isNew?: boolean;
}

export default function AdviceItem({ advice, onUpdate, onDelete, onSave, onDuplicate, isNew = false }: AdviceItemProps) {
  const [isExpanded, setIsExpanded] = useState(isNew);
  const [localAdvice, setLocalAdvice] = useState<Advice>(advice);
  const [isEnabled, setIsEnabled] = useState(advice.isEnabled);
  const [showHighlight, setShowHighlight] = useState(isNew);
  
  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => {
        setShowHighlight(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  useEffect(() => {
    setLocalAdvice(advice);
  }, [advice]);

  useEffect(() => {
    setIsEnabled(advice.isEnabled);
  }, [advice.isEnabled]);

  useEffect(() => {
    if (isNew) {
      setIsExpanded(true);
    }
  }, [isNew]);

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
    
    onUpdate(updatedAdvice);
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
    <div 
      className={showHighlight ? 'new-item-highlight' : ''} 
      style={{ 
        border: '1px solid #e0e0e0', 
        borderRadius: '4px',
        backgroundColor: '#f9f9f9',
        marginBottom: '16px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
      }}
    >
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