import React from 'react';
import LeveragePopup from './LeveragePopup';

const index = ({ handleClose, isForMobile }) => {
    return (
        <div style={{ position: 'absolute', top: '135%', left: 0, zIndex: 9999 }}>
            <LeveragePopup handleClose={handleClose} isForMobile={isForMobile} />
        </div>
    );
};

export default index;
