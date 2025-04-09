import React, { useState, useRef, useEffect } from 'react';

interface DropdownMenuProps {
  adviceId: string;
  dropdownPosition: { top: number; right: number };
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

export default function DropdownMenu({ 
  adviceId, 
  dropdownPosition, 
  onDuplicate, 
  onDelete, 
  onClose 
}: DropdownMenuProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && 
          !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  return (
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
      <div className="advice-dropdown-item">
        <span className="custom-button duplicate-button" onClick={(e) => {
          e.stopPropagation();
          if (onDuplicate) onDuplicate(adviceId);
          onClose();
        }}>
          Duplicate
        </span>
      </div>
      <div className="advice-dropdown-item">
        <span className="custom-button delete-button" onClick={(e) => {
          e.stopPropagation();
          if (onDelete) onDelete(adviceId);
          onClose();
        }}>
          Delete
        </span>
      </div>
      
      <style>
        {`
          .advice-dropdown-menu {
            min-width: 120px;
            background-color: white;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            border-radius: 4px;
            overflow: hidden;
            margin-top: 4px;
            padding: 8px 0;
          }
          
          .advice-dropdown-item {
            padding: 6px 8px;
            display: block;
            width: 100%;
            text-align: left;
          }
          
          .custom-button {
            display: block;
            width: 100%;
            text-align: left;
            background: transparent;
            border: none;
            cursor: pointer;
            font-size: 13px;
            font-weight: 400;
            padding: 4px 8px;
            font-family: inherit;
          }
          
          .duplicate-button {
            color: #F56910;
          }
          
          .delete-button {
            color: #666;
          }
        `}
      </style>
    </div>
  );
} 