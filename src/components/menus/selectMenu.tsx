
import React from 'react';
import styled from 'styled-components';

const SelectContainer = styled.div`
  position: relative;
  width: 200px;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  appearance: none; /* Removes default styling of select in WebKit browsers */
  background-color: white;
  font-size: 16px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const StyledOption = styled.option`
`;

const Arrow = styled.div`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  border-style: solid;
  border-width: 8px 5px 0 5px;
  border-color: #007bff transparent transparent transparent;
`;

interface SelectMenuProps {
    options: string[];
    value: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    name: string;
}

const SelectMenu: React.FC<SelectMenuProps> = ({ ...props }) => {
    return (
        <SelectContainer>
            <StyledSelect name={props.name} value={props.value} onChange={props.onChange}>
            {props.options.filter(option => option !== '').map((option) => (
                <StyledOption key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
                </StyledOption>
            ))}
            </StyledSelect>
        <Arrow />
    </SelectContainer>
)};

export default SelectMenu;