import React from 'react';
import styled from 'styled-components';

/**
 * A styled input component that is mainly supposed to be used
 * for 1-line inputs.
 */
const LineInputWrapper = styled.input`
  align-items: center;
  width: 95%;
  padding: 0.5rem;
  margin: 0 auto;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
`;

interface LineInputProps {
    style?: React.CSSProperties;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    name?: string;
    type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
    required?: boolean;
}

const LineInput: React.FC<LineInputProps> = ({ ...props }) => {
    return (
        <LineInputWrapper
            style={
                {
                    ...props.style
                }
            }
            value={props.value}
            onChange={props.onChange}
            placeholder={props.placeholder}
            name={props.name}
            type={props.type}
            required={props.required}
        />
    );
}


export default LineInput;