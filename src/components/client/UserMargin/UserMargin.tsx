import React, {useState, useEffect, useCallback} from 'react';
import styled from 'styled-components';
import useUserMargin from '../../../hooks/useUserMargin';
import formatNumber from '../../../lib/formatNumber';
import {useTypedSelector} from '../../../states/useTypedSelector';

type PropsType = {
    style: Record<string, any>;
};

const UserMargin = ({style}: PropsType) => {
    const data = useTypedSelector((state) => state.orderReducer);
    const {data: userMargin, dataColumn: menuData, refetch} = useUserMargin();
    const [refreshActive, setRefreshActive] = useState(false);

    useEffect(() => {
        refetch();
    }, [data]);

    const marginRefresh = useCallback(() => {
        setRefreshActive(true);
        setTimeout(() => {
            setRefreshActive(false);
        }, 1000)
        refetch();
    },[userMargin])

    return (
        <>
            <RefreshBtn>
                <button className={`refresh-btn ${refreshActive ? 'active':''}`} onClick={marginRefresh}>
                    <svg x="0px" y="0px" viewBox="0 0 1000 1000" className="refresh-icon">
                        <g>
                            <path d="M990,763.2L923.4,500L728.8,689.3l83.5,23.6C742.4,815.8,626.8,878.1,500,878.1c-146.2,0-276.8-81.8-340.5-213.6L77.8,704C155.6,864.9,321.3,968.8,500,968.8c167.3,0,318.2-87.9,402.5-230.4L990,763.2z" />
                            <path d="M187.8,287.2C257.5,184.3,373.1,121.9,500,121.9c142.7,0,271.8,78.9,336.7,206l80.9-41.3C837,129.1,677,31.2,500,31.2c-167.3,0-318.1,87.9-402.5,230.5L10,236.9L76.6,500l194.6-189.3L187.8,287.2z" />
                        </g>
                    </svg>
                </button>
            </RefreshBtn>
            <Menu style={style}>
                {menuData.map((menu, index) => (
                    <Item key={index}>
                        <Category>{menuData[index]}</Category>
                        <Data>{userMargin.length > 0 && userMargin[index]}</Data>
                    </Item>
                ))}
            </Menu>
        </>
    );
};

export default React.memo(UserMargin);

const RefreshBtn = styled.div`
    padding-top: 15px;
    text-align: right;
    >button{
        background-color: transparent;
        border:none;
        >svg{ width:15px;
         >g{ fill:#fff; }
        }
        &.active{ 
           animation:refresh 1s;
        }
    }
    
    @keyframes refresh {
     to{ transform: rotate(-360deg); }
    }
`;

const Menu = styled.ul`
    padding: 10px 0;
    font-size: ${({theme}) => theme.fontSizes.content};
    color: ${({theme}) => theme.colors.normalTextColor};
`;

const Item = styled.li`
    display: flex;
    height: ${({theme}) => theme.tabMenu.rowHeight};
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0 10px;
    &:hover {
        /* cursor: pointer; */
        //background-color: #f5f6fb;
        //font-weight: 700;
        //color: #5461bd;
    }
    & > span {
        display: inline-block;
        line-height: 40px;
        vertical-align: middle;
    }
`;

const Category = styled.span``;

const Data = styled.span`
    width: 100px;
    text-align: right;
`;
