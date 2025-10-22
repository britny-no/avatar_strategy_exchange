import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

//!!!Documentation
/*=============================================================
Step 1: In parents container, specify below attributes.

const [opened, setOpened]= useState(false)

const handleClick=()=>{
    setOpened(!opened)
}

const modalStyle={
    width:'50vw',
    height: '20vh'
}

Step 1: Feed them in Modal component.
<Modal opened={opened} setOpened={setOpened} options={modalStyle}>
<div>
    <button onClick={handleClick}>button</button>
    hi i am inside modal
</div>
</Modal>
============================================================*/

interface PropsType {
    opened: boolean;
    setOpened: (value: boolean) => void;
    children: React.ReactNode;
    options?: {
        height: number;
        width: number;
    };
    positions?: {
        x?: number | string;
        y?: number | string;
    };
    closeButtonVisible: boolean;
}

const Modal = ({
    opened,
    setOpened,
    children,
    options,
    positions = {
        x: 0,
        y: 0,
    },
    closeButtonVisible = true,
}: PropsType) => {
    const clickAway = (e) => {
        const target = e.target.closest('.modal-cont');
        if (target) {
        } else {
            console.log(`clicekd!!`);
            setOpened(false);
        }
    };

    const modalContentWrapperStyle = {
        height: options?.height,
        width: options?.width,
        top: positions.y,
    };

    return opened ? (
        <ModalWrapper onClick={clickAway}>
            <ModalContentWrapper className="modal-cont" style={modalContentWrapperStyle}>
                {/* {closeButtonVisible && (
                    <div className="modal-close-btn btn" onClick={() => setOpened(false)}>
                        X
                    </div>
                )} */}

                {children}
            </ModalContentWrapper>
        </ModalWrapper>
    ) : (
        <></>
    );
};

export default Modal;

const ModalWrapper = styled.div`
    z-index: 10;
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(175, 127, 127, 0.5);
`;

const ModalContentWrapper = styled.div`
    transition: 0.3s all ease-in-out;
    // width:30vw;
    // height:85vh;
    border-radius: 0.5rem;
    z-index: 1;
    position: absolute;

    /* box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.07), 0 6px 5px 0 rgba(0, 0, 0, 0.07); */
    /* padding:2rem; */
`;
