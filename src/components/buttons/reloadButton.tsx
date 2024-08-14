import React from 'react';
import reloadBackgroundIcon from '../../assets/icons/reloadIcon01.png'
import styled from 'styled-components';

interface ReloadButtonProps {
    onClick?: () => void;
    children?: React.ReactNode;
    type?: 'button' | 'submit' | 'reset' | undefined;
}

const ReloadButtonContainer = styled.button`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    align-content: start;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 20px;
`;

const ReloadButton: React.FC<ReloadButtonProps> = ({ ...props }) => {
    return (
        <ReloadButtonContainer
            onClick={props.onClick}
            type={props.type}
        >
            <img src={reloadBackgroundIcon} alt="Reload" style={{
                width: '20px',
                height: '20px',
                cursor: 'pointer',
                alignContent: 'start',
                display: 'flex',
                flexDirection: 'column', // Stack children vertically
                msFlexDirection: 'column',
                justifyContent: 'flex-start' // Align children to the top
            }}/>
            {props.children && props.children}
        </ReloadButtonContainer>
    );
}

export default ReloadButton;