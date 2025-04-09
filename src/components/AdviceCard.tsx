import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'datocms-react-ui';
import { API_PROVIDERS } from '../models/apiProvider';
import { Advice } from '../models/advice';

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
  const dropdownRef = useRef<HTMLDivElement>(null);
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
  
  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && 
          !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
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
        <div>
          <h3 style={{ margin: 0 }}>{advice.name}</h3>
          <span style={{ fontSize: '0.9em', color: '#666' }}>
            {API_PROVIDERS[advice.apiProvider].name}
          </span>
        </div>
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
          
          <div 
            ref={buttonRef}
            style={{ position: 'relative' }}
          >
            <button
              className="menu-dots-button"
              onClick={handleMenuToggle}
            >
              <div className="menu-dots">
                <span className="menu-dot"></span>
                <span className="menu-dot"></span>
                <span className="menu-dot"></span>
              </div>
            </button>
          </div>
          
          {dropdownOpen && (
            <div
              ref={dropdownRef}
              className="advice-dropdown-menu"
              style={{
                position: 'fixed',
                top: `${dropdownPosition.top}px`,
                right: `${dropdownPosition.right}px`,
                zIndex: 9999
              }}
            >
              <button
                className="advice-dropdown-item"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onDuplicate) onDuplicate(advice.id);
                  setDropdownOpen(false);
                }}
              >
                Duplicate
              </button>
              <button
                className="advice-dropdown-item advice-dropdown-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onDelete) onDelete(advice.id);
                  setDropdownOpen(false);
                }}
              >
                Delete
              </button>
            </div>
          )}
          
          <style>
            {`
              .menu-dots-button {
                background: none;
                border: none;
                cursor: pointer;
                padding: 5px 6px;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                outline: none;
              }
              
              .menu-dots-button:hover {
                background-color: rgba(0, 0, 0, 0.05);
              }
              
              .menu-dots {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 2px;
              }
              
              .menu-dot {
                width: 3px;
                height: 3px;
                border-radius: 50%;
                background-color: #666;
              }
              
              .advice-dropdown-menu {
                min-width: 150px;
                background-color: white;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                border-radius: 4px;
                overflow: hidden;
                margin-top: 4px;
                padding: 6px 0;
              }
              
              .advice-dropdown-item {
                display: block;
                width: 100%;
                padding: 12px 16px;
                border: none;
                background: none;
                text-align: left;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.2s;
                margin: 2px 0;
              }
              
              .advice-dropdown-item:hover {
                background-color: #f5f5f5;
              }
              
              .advice-dropdown-delete {
                color: #e34850;
              }
            `}
          </style>
        </div>
      </div>
    </div>
  );
} 