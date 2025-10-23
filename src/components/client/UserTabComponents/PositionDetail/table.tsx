import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { useDispatch } from 'react-redux';
import ScrollBar from '@/styled/ScrollBar';
import { useTypedSelector } from '@/states/useTypedSelector';
import socketService from '@/states/socketAgent/SocketService';
import { deleteTr } from '@/states/reducers/stateReducer';
import useUsersData from '@/hooks/useUserData';
import useScreenSize from '@/hooks/useScreenSize';
import Loading from '@/components/svgs/Loading';

interface IBaseTableProps {
    data: Array<any>;
    dataColumn: Array<string>;
    maxWidth?: number | string;
    maxHeight?: number | string;
    rowHeight?: number;
    disableClick?: boolean;
    handleClick?: (data: Record<string, any>) => () => void;
}

const BaseTable: React.FC<IBaseTableProps> = ({
    data = [],
    dataColumn = [],
    maxWidth = 580,
    maxHeight = 580,
    rowHeight = 60,
    disableClick = false,
    handleClick = () => () => { },
}) => {
    const dispatch = useDispatch();
    const { email, jwt, szAccNo } = useUsersData();
    const { isMobile } = useScreenSize();

    const t0306 = useTypedSelector((state) => state.stateReducer.t0306);
    const t3216 = useTypedSelector((state) => state.stateReducer.t3216);
    const [loading, setLoading] = useState(false);

    const reloadAsset = () => {
        socketService.sendToAgent({
            Header: {
                function: 'D',
                termtype: 'HTS',
                trcode: 't3720',
                userid: email,
                token: jwt,
            },
            Input1: {
                szAccNo: szAccNo,
            },
        });
    };

    useEffect(() => {
        if (!t0306) {
            socketService.sendToAgent({
                Header: {
                    function: 'D',
                    termtype: 'HTS',
                    trcode: 't0306',
                },
                Input1: {
                    select_flag: '0',
                    comp_code: "000",
                    hts_id: email,
                    name: '',
                },
            });
        }
    }, [email, jwt, t0306]);

    const reqCounterTrade = (dataRow: any) => {
        if (t0306?.Output2 && dataRow) {
            dispatch(deleteTr({ key: 't3216', data: null }));
            socketService.sendToAgent({
                Header: {
                    function: "D",
                    termtype: "HTS",
                    trcode: "t3216",
                },
                Input1: {
                    szAccNo: szAccNo,
                    szPasswd: t0306.Output2[0][3],
                    szCurNo: dataRow[0],
                    fOrderSu: dataRow[1],
                    fOrderPrice: dataRow[4],
                    szDealDiv: dataRow[2] === "Buy" ? "081" : "079",
                    // Other parameters...
                },
            });
        }
    };

    useEffect(() => {
        if (loading && t3216) {
            const { flag, data } = t3216.Message;
            setLoading(false);
            if (flag === 'E') {
                alert(data);
            } else if (flag === '0') {
                // Handle successful case
            } else {
                alert(data);
            }
        }
    }, [t3216, loading]);

    const renderTableRows = () => {
        return data.map((dataRow, index) => (
            <ContentRow
                key={index}
                onClick={!disableClick ? handleClick(dataRow) : () => { }}
            >
                {dataColumn.map((colKey, colIndex) => (
                    colIndex !== 10 ? (
                        <TableData key={colIndex} num={colIndex} val={dataRow[colIndex]}>
                            {dataRow[colIndex]}
                        </TableData>
                    ) : (
                        <TableDataButton key={colIndex} num={colIndex} val={dataRow[colIndex]} onClick={() => reqCounterTrade(dataRow)}>
                            Close All
                        </TableDataButton>
                    )
                ))}
            </ContentRow>
        ));
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <Wrapper>
            <StTable>
                <thead>
                    <HeaderRow>
                        {dataColumn.map((colKey, index) => (
                            <th key={index}>
                                {colKey}
                            </th>
                        ))}
                    </HeaderRow>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        renderTableRows()
                    ) : (
                        <ContentRow>
                            <td className="empty" colSpan={dataColumn.length}>
                                No data was retrieved
                            </td>
                        </ContentRow>
                    )}
                </tbody>
            </StTable>
        </Wrapper>
    );
};

export default React.memo(BaseTable);

const Wrapper = styled(ScrollBar)`
    overflow: auto;
    height: 385px;
`;

const HeaderRow = styled.tr``;

const ContentRow = styled.tr`
    height: ${({ theme }) => theme.tabMenu.rowHeight};

    .empty {
        text-align: center;
        padding: 150px 0;
    }
`;

const StTable = styled.table`
    border-collapse: collapse;
    border-radius: 15px;
    width: 100%;
    color: ${({ theme }) => theme.colors.normalTextColor};

    ${HeaderRow} {
        th {
            border-bottom: 1px solid ${({ theme }) => theme.colors.secondaryColor};
            text-align: center;
            color: ${({ theme }) => theme.colors.normalTextColor};
            background: ${({ theme }) => theme.colors.primaryColor};
            font-size: ${({ theme }) => theme.fontSizes.content};
            padding: 7px 15px;
            position: sticky;
            top: 0;
        }
    }
`;

const TableData = styled.td<{ num: number; val: number }>`
    ${props => props.num === 6 && props.val > 0 && css`
        color: rgb(65, 218, 120);
    `}
    ${props => props.num === 6 && props.val < 0 && css`
        color: red;
    `}
    white-space: nowrap;
    text-align: center;
    font-size: ${({ theme }) => theme.fontSizes.content};
    vertical-align: middle;
    border-bottom: 1px solid ${({ theme }) => theme.colors.secondaryColor};
`;

const TableDataButton = styled.td<{ num: number; val: number }>`
    ${props => props.num === 6 && props.val > 0 && css`
        color: rgb(65, 218, 120);
    `}
    ${props => props.num === 6 && props.val < 0 && css`
        color: red;
    `}
    white-space: nowrap;
    text-align: center;
    font-size: ${({ theme }) => theme.fontSizes.content};
    vertical-align: middle;
    border-bottom: 1px solid ${({ theme }) => theme.colors.secondaryColor};
    cursor: pointer;
    background-color:rgba(0, 161, 255, 0.8);

    &:active {
        transform: scale(0.95);
    }
`;
