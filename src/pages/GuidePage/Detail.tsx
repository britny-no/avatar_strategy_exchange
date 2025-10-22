import React from 'react';
import styled from 'styled-components';
import { useLocation, useParams } from 'react-router-dom';
// import { USER_GUIDES } from '../../../constants/Guides';
import useGuides from "@/hooks/useGuides"

const Details = () => {
    const {guidesArray} = useGuides()
    const { shortcut, id } = useParams<{ shortcut: string | undefined; id: string }>();

    const getContents = () => {
        const content = guidesArray.filter((data) => data.type === shortcut)[id];
        return (
            content !== null &&
            content !== undefined && (
                <Wrap>
                    <p className="title">{content.title}</p>
                    <p className="contents">{content.contents}</p>
                </Wrap>
            )
        );
    };
    return <Wrap>{getContents()}</Wrap>;
};

export default Details;

const Wrap = styled.div`
    width: 100%;
    background: #fff;
    .title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 20px;
    }
`;
