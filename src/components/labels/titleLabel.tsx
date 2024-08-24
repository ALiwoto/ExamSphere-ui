import React from "react";
import { CurrentAppTranslation } from "../../translations/appTranslation";

interface TitleLabelProps {
    children?: React.ReactNode;
    style?: React.CSSProperties;
}

const TitleLabel: React.FC<TitleLabelProps> = ({ ...props }) => {
    return <h1 style={
        {
            fontSize: '24px',
            marginInline: 'auto',
            direction: `${CurrentAppTranslation.direction}`,
            ...props.style
        }
    }>
        {props.children}
    </h1>;
};

export default TitleLabel;