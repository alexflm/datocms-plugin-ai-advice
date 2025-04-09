import React, { useState, useRef, useEffect } from 'react';
import { Dropdown, DropdownMenu as DatoDropdownMenu, DropdownOption } from 'datocms-react-ui';

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
  return (
    <div 
      style={{
        position: 'fixed',
        top: `${dropdownPosition.top}px`,
        left: `${window.innerWidth - dropdownPosition.right - 200}px`,
        zIndex: 9999,
        width: '80px',
        maxWidth: '80px'
      }}
    >
      <div style={{ width: '80px', maxWidth: '80px', overflow: 'hidden' }}>
        <DatoDropdownMenu>
          {onDuplicate && (
            <DropdownOption 
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(adviceId);
                onClose();
              }}
            >
              Duplicate
            </DropdownOption>
          )}
          {onDelete && (
            <DropdownOption 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(adviceId);
                onClose();
              }}
              red
            >
              Delete
            </DropdownOption>
          )}
        </DatoDropdownMenu>
      </div>
      
      <style>
        {`
          /* Ограничение ширины элементов выпадающего меню */
          [data-menu-content] {
            width: 80px !important;
            max-width: 80px !important;
            min-width: 0 !important;
          }
          
          [data-focusable-element] {
            width: 100% !important;
            max-width: 80px !important;
            min-width: 0 !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
          }
          
          [data-menu] {
            width: 80px !important;
            max-width: 80px !important;
            min-width: 0 !important;
          }
          
          button[data-menu-item] {
            width: 80px !important;
            max-width: 80px !important;
            min-width: 0 !important;
          }
        `}
      </style>
    </div>
  );
} 