import React, { forwardRef, ForwardedRef } from 'react';

interface MenuButtonProps {
  onClick: (e: React.MouseEvent) => void;
}

const MenuButton = forwardRef(({ onClick }: MenuButtonProps, ref: ForwardedRef<HTMLDivElement>) => {
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        className="menu-dots-button"
        onClick={onClick}
      >
        <div className="menu-dots">
          <span className="menu-dot"></span>
          <span className="menu-dot"></span>
          <span className="menu-dot"></span>
        </div>
      </button>
      
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
        `}
      </style>
    </div>
  );
});

MenuButton.displayName = 'MenuButton';

export default MenuButton; 