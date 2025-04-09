import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'datocms-react-ui';
import { Advice } from '../models/advice';
import CardHeader from './AdviceCard/CardHeader';
import DropdownMenu from './AdviceCard/DropdownMenu';
import MenuButton from './AdviceCard/MenuButton';
import '../styles/AdviceCard.css';

interface AdviceCardProps {
  advice: Advice;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleEnabled: (enabled: boolean) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
  bordered?: boolean;
}

export default function AdviceCard({ 
  advice, 
  isExpanded, 
  onToggleExpand, 
  onToggleEnabled,
  onDuplicate,
  onDelete,
  bordered = true
}: AdviceCardProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  
  useEffect(() => {
    if (dropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        right: window.innerWidth - rect.right
      });
    }
  }, [dropdownOpen]);
  
  // Handle menu toggle
  const handleMenuToggle = (e: React.MouseEvent) => {
    // Prevent opening/closing when clicking on buttons
    if ((e.target as HTMLElement).closest('.action-button')) {
      return;
    }
    setDropdownOpen(!dropdownOpen);
  };
  
  const handleCardClick = (event: React.MouseEvent) => {
    // Prevent opening/closing when clicking on buttons
    if (
      event.target instanceof HTMLButtonElement || 
      (event.target as HTMLElement).closest('button') || 
      (event.target as HTMLElement).closest('.dropdown-controls')
    ) {
      return;
    }
    
    onToggleExpand();
  };
  
  return (
    <div 
      style={{ 
        ...(bordered ? {
          border: '1px solid #e0e0e0', 
          borderRadius: isExpanded ? '4px 4px 0 0' : '4px', 
          padding: '16px',
          marginBottom: isExpanded ? 0 : '16px',
          backgroundColor: '#f9f9f9'
        } : {}),
        cursor: 'pointer'
      }}
      onClick={handleCardClick}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <CardHeader advice={advice} />
        
        <div className="dropdown-controls" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand();
            }} 
            buttonSize="xxs"
            buttonType="muted"
          >
            {isExpanded ? 'Collapse' : 'Configure'}
          </Button>
          
          <MenuButton 
            ref={buttonRef}
            onClick={handleMenuToggle}
          />
          
          {dropdownOpen && (
            <DropdownMenu 
              adviceId={advice.id}
              dropdownPosition={dropdownPosition}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
              onClose={() => setDropdownOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
} 