import React, { useState } from 'react';
import styled from 'styled-components';

const MenuItemWrapper = styled.div`
  cursor: pointer;
`;

const MenuItemHeader = styled.div`
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const MenuItemChildren = styled.div<{ $isOpen: boolean }>`
  max-height: ${props => props.$isOpen ? '1000px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
`;

const ChildItem = styled.div`
  padding: 5px 0 5px 20px;
  &:hover {
    background-color: #e0e0e0;
  }
`;

interface MenuItemProps {
  label: string;
  children?: React.ReactNode;
}

const MenuItem: React.FC<MenuItemProps> = ({ ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { label, children } = props;

  return (
    <MenuItemWrapper>
      <MenuItemHeader onClick={() => setIsOpen(!isOpen)}>
        {label}
      </MenuItemHeader>
      {children && (
        <MenuItemChildren $isOpen={isOpen}>
          {React.Children.map(children, child => (
            <ChildItem>{child}</ChildItem>
          ))}
        </MenuItemChildren>
      )}
    </MenuItemWrapper>
  );
};

export default MenuItem;