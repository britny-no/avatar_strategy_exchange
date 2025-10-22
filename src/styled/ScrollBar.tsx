import styled from 'styled-components';

const ScrollBar = styled.div`
    &::-webkit-scrollbar-track {
    }

    &::-webkit-scrollbar {
        width: 7px;
        height: 7px;
    }

    &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        width: 7px;
    }

    ::-webkit-scrollbar-corner {
       
    }
`;
export default ScrollBar;
