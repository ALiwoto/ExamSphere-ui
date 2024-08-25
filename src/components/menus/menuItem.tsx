import React, { useState } from 'react';
import styled from 'styled-components';
import { CurrentAppTheme } from '../../themes/appThemeBase';
import { CurrentAppTranslation } from '../../translations/appTranslation';

const MenuItemWrapper = styled.div`
  cursor: pointer;
`;

const MenuItemHeader = styled.a`
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
  color: ${CurrentAppTheme.primaryMenuTextColor}
  &:hover {
    background-color: #f0f0f0;
    border-radius: 4px;
  }
  &:visited {
    color: ${CurrentAppTheme.primaryMenuTextColor}; // This makes the visited link color the same as the normal state
  }
`;

const MenuItemChildren = styled.div<{ $isOpen: boolean }>`
  max-height: ${props => props.$isOpen ? '100%' : '0'};
  overflow: hidden;
  transition: max-height 0.1s linear;
`;

const ChildItem = styled.div`
  padding: 5px 0 5px 20px;
`;

interface MenuItemProps {
    label: string;
    children?: React.ReactNode;
    href?: string;
    onClick?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ ...props }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { label, children, href } = props;

    return (
        <MenuItemWrapper>
            <MenuItemHeader
                onClick={() => {
                    setIsOpen(!isOpen);
                    props.onClick?.();
                }}
                style={{
                    justifyContent: CurrentAppTranslation.justifyContent,
                }}
                href={href}
            >
                <div>
                    {label}
                </div>
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