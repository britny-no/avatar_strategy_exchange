import React from 'react';

interface IProps {
    width?: number;
    height?: number;
    fill?: string;
}
const Close = ({ width = 24, height = 24, fill = '#C5CDD5' }: IProps) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.9298 10.6138L17.6 5L19 6.38607L13.3298 11.9999L19 17.6136L17.6 18.9997L11.9298 13.3859L6.4 18.8607L5 17.4746L10.5298 11.9999L5 6.52508L6.4 5.13901L11.9298 10.6138Z"
                fill={fill}
            />
        </svg>
    );
};

export default Close;
