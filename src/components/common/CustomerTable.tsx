import React, {useMemo, useEffect, useState, useRef, useCallback} from 'react';
import styled from 'styled-components';
import ScrollBar from '../../styled/ScrollBar';
import formatNumber from '../../lib/formatNumber';
import TableSkeleton from '../client/UserTabComponents/common/TableSkeleton';
import {useTypedSelector} from '../../states/useTypedSelector';
import useSymbolList from '../../hooks/useSymbolList';
import unformatNumber from '../../lib/unformatNumber';

const DEAL_DIV_INDEX_IN_OPEN_ORDERS = 2;
const SYMBOL_ID_INDEX = 1;

interface IEachRowProps {
  d: any;
  originalData: any;
  keys: any;
  rowIndex: any;
  rowStyle: any;
  handleClickForStopLimitMarket?: (data: Record<string, any>, stopOrLimit: 'stop' | 'limit' | 'market') => () => void;
  handleClickForStopAndLimitModifyCancel?: (data: Record<string, any>, stopOrLimit: 'stop' | 'limit') => () => void;
  handleClickForOpenOrders?: (d: any, dealDiv: any) => (e: any) => void //(data: Record<string, any>, dealDiv: '079' | '080' | '081' | '082') => () => void;
  rowFor: string;
}

// eslint-disable-next-line react/display-name
const EachRow = React.memo<IEachRowProps>(
  ({
     d,
     originalData,
     keys,
     rowIndex,
     rowStyle,
     handleClickForStopLimitMarket = () => () => {
       alert('function not provided');
     },
     handleClickForStopAndLimitModifyCancel = () => () => {
       alert('function not provided');
     },
     handleClickForOpenOrders = () => () => {
       alert('function not provided');
     },
     rowFor
   }) => {
    // const szCurLiveData = useTypedSelector((state) => (state.stateReducer[`91_${d[SYMBOL_ID_INDEX].trim()}`] || [{}])[0]?.Output1, (a, b) => {
    //   return a.szTime - b.szTime < 200 || a.szClose === b.szClose;
    // });
    const symbolId = d[SYMBOL_ID_INDEX].trim();
    const szCurLiveData = useTypedSelector((state) => (state.stateReducer[`91_interval_${symbolId}`] || [{}])[0]?.Output1);
    const {symbolsInObjectForm: symbols} = useSymbolList();
    const pipLowest = Number(symbols[symbolId].PIP_LOWEST ?? 2);
    const [row, setRow] = useState(d);

    const updateRowForOpenOrders = (currentPrice) => {
      const newRow = [...row];
      newRow[5] = currentPrice;
      setRow(newRow);
    };

    const updateRowForPositionDetails = (currentPrice) => {
      const newRow = [...row];
      newRow[5] = currentPrice;
      if (newRow[2] === 'Buy') {
        newRow[8] = unformatNumber(newRow[5]) - unformatNumber(newRow[3]);
      } else {
        newRow[8] = unformatNumber(newRow[3]) - unformatNumber(newRow[5]);
      }
      newRow[9] = formatNumber(newRow[8] * newRow[4],pipLowest);
      newRow[8] = formatNumber(newRow[8], pipLowest);
      setRow(newRow);
    };

    useEffect(() => {
        const close = szCurLiveData?.szClose ?? 0;
        if ( close) {
          const currentPrice = formatNumber(close, pipLowest);
          rowFor === 'open-orders'
            ? updateRowForOpenOrders(currentPrice)
            : updateRowForPositionDetails(currentPrice);
        }
    }, [szCurLiveData]);

    const renderForOpenOrders = () => {
      return (
        <ContentRow
          key={d[0]}
          style={{...rowStyle, cursor: 'pointer'}}
          onClick={handleClickForOpenOrders(originalData[rowIndex], d[DEAL_DIV_INDEX_IN_OPEN_ORDERS])}
        >
          {keys.map((key, fieldIndex) => (
            <Field key={fieldIndex} value={row[fieldIndex]} />
          ))}
        </ContentRow>
      );
    };

    const renderForOpenPositions = () => {
      //12, 13 ,14 index is for
      // 'Market',
      // 'Stop M/C',
      // 'Limit M/C',
      const newRow = [...row];
      newRow.splice(12, 0, 'market');
      // console.log(newRow)  
      return (
        <ContentRow key={d[0]} style={rowStyle}>
          {keys.map((key, fieldIndex) => {
            // indx 6 = stop / index 7 = limit
            const newRowFieldIndex = newRow[fieldIndex];
            // console.log(newRow[0], newRow[3])
            switch(fieldIndex){
              case 4:
              case 5:
                return (
                  <Field
                    key={fieldIndex}
                    value={newRowFieldIndex}
                    onClick={handleClickForStopAndLimitModifyCancel(originalData[rowIndex], 'limit')}
                    fieldStyle={{
                      cursor: 'pointer'
                    }}
                  />
                );
              case 6:
                return (
                  <Field
                    key={fieldIndex}
                    value={newRowFieldIndex}
                    onClick={
                      Number(newRowFieldIndex) === 0
                        ? handleClickForStopLimitMarket(originalData[rowIndex], 'stop')
                        : handleClickForStopAndLimitModifyCancel(originalData[rowIndex], 'stop')
                    }
                    fieldStyle={{
                      color: 'red',
                      cursor: 'pointer'
                    }}
                  />
                );
              case 7:
                return (
                  <Field
                    key={fieldIndex}
                    value={newRowFieldIndex}
                    onClick={
                      Number(newRowFieldIndex) === 0
                        ? handleClickForStopLimitMarket(originalData[rowIndex], 'limit')
                        : handleClickForStopAndLimitModifyCancel(originalData[rowIndex], 'limit')
                    }
                    fieldStyle={{
                      color: '#41DA78',
                      cursor: 'pointer'
                    }}
                  />
                );
              case 9:
                const rep_value = newRowFieldIndex.replace(/,/g, '')
                const style_ob = Number(rep_value) !== 0 ? {color: rep_value > 0 ? 'rgb(65, 218, 120)': 'red',} : {}
                return (
                  <Field
                    key={fieldIndex}
                    value={newRowFieldIndex}
                    fieldStyle={{
                      ...style_ob,
                      cursor: 'pointer'
                    }}
                  />
                );
              case 12:
                return (
                  <Field
                    key={fieldIndex}
                    value={'Market'}
                    onClick={handleClickForStopLimitMarket(originalData[rowIndex], 'market')}
                    fieldStyle={{
                      color: '#F8585A',
                      cursor: 'pointer'
                    }}
                  />
                );
              default:
                return (
                      <Field
                        key={fieldIndex}
                        value={newRowFieldIndex}
                        onClick={handleClickForStopLimitMarket(originalData[rowIndex], 'market')}
                      />
                )
            }
          })}
        </ContentRow>
      );
    };
    return rowFor === 'open-orders' ? renderForOpenOrders() : renderForOpenPositions();
  }
);

interface ICustomerTableProps {
  isSuccess: boolean;
  data: Record<string, any>;
  dataColumn;
  tableFor: string, //'open-positions' | 'open-orders';
  originalData: Array<any>;
  maxWidth?: number;
  minWidth?: number;
  maxHeight?: number;
  rowHeight?: number;
  handleClickForOpenOrders: (d: any, dealDiv: any) => (e: any) => void, //(data: Record<string, any>, dealDiv: '079' | '080' | '081' | '082') => () => void;
  clickEventForOpenPositions?: {
    handleClickForStopLimitMarket: () => () => void;
    handleClickForStopAndLimitModifyCancel: () => () => void;
  };
}

// open-order과 position-detail 구별해놨는데, 기능적 통합은 추후에 진행. 현재는 따로 진행
const CustomerTable = ({
                         isSuccess = false,
                         data = [],
                         dataColumn = [],
                         originalData = [],
                         maxWidth = 580,
                         minWidth = 580,
                         maxHeight = 580,
                         rowHeight = 60,
                         tableFor,
                         handleClickForOpenOrders = () => () => {
                           alert('handle click function not provided');
                         },
                         clickEventForOpenPositions = {
                           handleClickForStopLimitMarket: () => () => {
                             alert('StopLimitMarket not provided');
                           },
                           handleClickForStopAndLimitModifyCancel: () => () => {
                             alert('StopAndLimitModifyCancel function not provided');
                           }
                         }
                       }: ICustomerTableProps) => {
  const keys = dataColumn;
  const tableStyle = {maxWidth};
  const rowStyle = {};



  const {handleClickForStopLimitMarket, handleClickForStopAndLimitModifyCancel} = clickEventForOpenPositions;

  const renderTableBodyForOpenPositions = () => {
    return data.map((d, rowIndex) => (

      //here
      <EachRow
        d={d}
        key={JSON.stringify(d)}
        originalData={originalData}
        keys={keys}
        rowIndex={rowIndex}
        rowStyle={rowStyle}
        handleClickForStopLimitMarket={handleClickForStopLimitMarket}
        handleClickForStopAndLimitModifyCancel={handleClickForStopAndLimitModifyCancel}
        rowFor={tableFor}
      />
    ));
  };

  const renderTableBodyForOpenOrders = () => {
    const availableData = data.filter(d => d[10] !== '취소접수' && d[8] !== ' ');
    return availableData.map((d, rowIndex) => (
      <EachRow
        key={JSON.stringify(d)}
        d={d}
        originalData={originalData}
        keys={keys}
        rowIndex={rowIndex}
        rowStyle={rowStyle}
        handleClickForStopLimitMarket={handleClickForStopLimitMarket}
        handleClickForStopAndLimitModifyCancel={handleClickForStopAndLimitModifyCancel}
        handleClickForOpenOrders={handleClickForOpenOrders}
        rowFor={tableFor}
      />
    ));
  };

  return (
    <Wrapper style={tableStyle}>
      {data.length || isSuccess ? (
        <StTable>
          <thead>
          <HeaderRow>{keys && keys.map((key, i) => <th key={key}>{key}</th>)}</HeaderRow>
          </thead>

          <tbody>
          {tableFor === 'open-positions'
            ? renderTableBodyForOpenPositions()
            : renderTableBodyForOpenOrders()}
          </tbody>
        </StTable>
      ) : (
        <TableSkeleton style={tableStyle} />
      )}
    </Wrapper>
  );
};

export default CustomerTable;

const Wrapper = styled(ScrollBar)`
  overflow: auto;
  height: 385px;
`;

const HeaderRow = styled.tr``;
const ContentRow = styled.tr`
    height: ${({theme}) => theme.tabMenu.rowHeight};

    td:first-child {
        text-align: end;
        padding-right: 20px;
    }

    &:hover td {
      border-top: 1px solid #8d92dd;
      border-bottom: 1px solid #8d92dd;
    }
`;
const StTable = styled.table`
    overflow: scroll;
    border-radius: 15px;
    width: inherit;
    font-size: ${({theme}) => theme.fontSizes.content};
    color: ${({theme}) => theme.colors.normalTextColor};

    ${HeaderRow} {
        white-space: nowrap;

        th {
            border-bottom: 1px solid ${({theme}) => theme.colors.secondaryColor};
            text-align: center;
            color: ${({theme}) => theme.colors.normalTextColor};
            background: ${({theme}) => theme.colors.primaryColor};
            font-size: ${({theme}) => theme.fontSizes.content};

            padding: 7px 14px;
            position: sticky;
            top: 0;
        }
    }
`;

interface IFieldProps {
  value: string | number;
  key: number;
  fieldStyle?: Record<string, any>;
  onClick?: () => void;
}

const Field = ({value, fieldStyle = {}, onClick}: IFieldProps) => {
  return (
    <Td style={fieldStyle} onClick={onClick}>
      {value}
    </Td>
  );
};

const Td = styled.td`
    padding: 0 4px;
    text-align: center;
    vertical-align: middle;
    border-bottom: 1px solid ${({theme}) => theme.colors.secondaryColor};
    height: ${({theme}) => theme.tabMenu.rowHeight};
`;