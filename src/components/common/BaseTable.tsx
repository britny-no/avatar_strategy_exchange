import React, { useMemo } from 'react';
import styled from 'styled-components';
import ScrollBar from '../../styled/ScrollBar';

interface IBaseTableProps {
    data: Array<any>;
    dataColumn: Array<any>;
    maxWidth?: number | string;
    maxHeight?: number | string;
    rowHeight?: number;
    disableClick?: boolean;
    handleClick?: (data: Record<string, any>) => () => void;
}

const BaseTable = ({
    data = [],
    dataColumn = [],
    maxWidth = 580,
    maxHeight = 580,
    rowHeight = 60,
    disableClick = false,
    handleClick = () => () => {
        // alert('function not provided');
    },
}: IBaseTableProps) => {
    const keys = dataColumn;

    const tableStyle = { maxWidth, maxHeight, height: maxHeight };
    const rowStyle = {};
    const emptyHandleClick = () => () => {
        // click is disabled
    };

    return (
        <Wrapper style={tableStyle}>
            <StTable>
                <thead>
                    <HeaderRow>
                        {keys &&
                            keys.map((key, i) => (
                                <th key={i}>
                                    {key}
                                </th>
                            ))}
                    </HeaderRow>
                </thead>
                {data.length > 0 ? (
                  <tbody>
                  {data.map((d, i) => (
                    <ContentRow
                      key={i}
                      style={rowStyle}
                      onClick={!disableClick ? handleClick(d) : emptyHandleClick()}
                    >
                        {keys.map((key, index) => (
                          <TableData key={index}>{d[index]}</TableData>
                        ))}
                    </ContentRow>
                  ))}
                  </tbody>
                ) : (
                  <tbody>
                  <ContentRow style={rowStyle}>
                      <td className="empty" colSpan={keys.length}>No data was retrieved</td>
                  </ContentRow>
                  </tbody>
                )}
            </StTable>
        </Wrapper>
    );
};

export default React.memo(BaseTable);

const Wrapper = styled(ScrollBar)`
    overflow: auto;
`;

const HeaderRow = styled.tr``;
const ContentRow = styled.tr`
    height: ${({ theme }) => theme.tabMenu.rowHeight};
    .empty{
        text-align: center;
        padding: 150px 0px;
    }
    /* &:hover {
  background-color: #f3ebeb !important;
} */
`;
const StTable = styled.table`
    border-collapse: collapse;
    border-radius: 15px;
    width: 100%;
    color: ${({ theme }) => theme.colors.normalTextColor};

    ${HeaderRow} {
        white-space: nowrap;

        th {
            border-bottom: 1px solid ${({ theme }) => theme.colors.secondaryColor};
            text-align: center;
            color: ${({ theme }) => theme.colors.normalTextColor};
            background: ${({ theme }) => theme.colors.primaryColor};
            font-size: ${({ theme }) => theme.fontSizes.content};

            padding: 7px 15px;
            position: sticky;
            top: 0px;
        }
    }
`;

const TableData = styled.td`
    white-space: nowrap;
    text-align: center;
    font-size: ${({ theme }) => theme.fontSizes.content};
    vertical-align: middle;
    border-bottom: 1px solid ${({ theme }) => theme.colors.secondaryColor};
`;
