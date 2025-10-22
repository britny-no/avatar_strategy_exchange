import React from 'react';

interface IProps {
    width?: number;
    height?: number;
    fill?: string;
}

const MobileMenu = ({ width = 24, height = 24, fill = '#FFFFFF' }: IProps) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
            <rect x="3" y="5" width="18" height="2" fill={fill} />
            <rect x="3" y="11" width="18" height="2" fill={fill} />
            <rect x="3" y="17" width="12" height="2" fill={fill} />
        </svg>
    );
};

export default MobileMenu;
