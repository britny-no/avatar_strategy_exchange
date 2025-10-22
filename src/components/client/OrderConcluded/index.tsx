import BaseTable from '../../common/BaseTable';
import useNinetyFive from '../../../hooks/useNinetyFive';
import useNinetyEight from '../../../hooks/useNinetyEight';
import useNinetyNine from '../../../hooks/useNinetyNine';
import useNinetyOne from '../../../hooks/useNinetyOne';
import useSymbolList from '../../../hooks/useSymbolList';

const style = {
    maxWidth: 2400,
    maxHeight: 486,
    rowHeight: 47,
};

export default function Index() {
    const { data, dataColumn } = useNinetyFive();

    const orderConcludedProps = {
        data,
        dataColumn,
    };

    return (
        <>
            <div
                style={{
                    border: '1px solid #dbdbdb',
                    maxWidth: style.maxWidth,
                    borderRadius: '6px',
                }}
            >
                <div>95번 실시간주문체결 테스팅</div>
                <BaseTable {...orderConcludedProps} {...style} />
            </div>
            <StopOrderTable />
            <LimitOrderTable />
            <CurrentPriceTable />
        </>
    );
}

const StopOrderTable = () => {
    const { data, dataColumn } = useNinetyEight();
    const props = {
        data,
        dataColumn,
    };

    return (
        <div
            style={{
                border: '1px solid #dbdbdb',
                maxWidth: style.maxWidth,
                borderRadius: '6px',
            }}
        >
            <div>98번 실시간</div>
            <BaseTable {...props} {...style} />
        </div>
    );
};
const LimitOrderTable = () => {
    const { data, dataColumn } = useNinetyNine();
    const props = {
        data,
        dataColumn,
    };

    return (
        <div
            style={{
                border: '1px solid #dbdbdb',
                maxWidth: style.maxWidth,
                borderRadius: '6px',
            }}
        >
            <div>99번 실시간 </div>
            <BaseTable {...props} {...style} />
        </div>
    );
};

const CurrentPriceTable = () => {
    const { currentSymbol } = useSymbolList();
    const { data, dataColumn } = useNinetyOne(currentSymbol);
    const props = {
        data,
        dataColumn,
    };

    return (
        <div
            style={{
                border: '1px solid #dbdbdb',
                maxWidth: style.maxWidth,
                borderRadius: '6px',
            }}
        >
            <div>91번 실시간 </div>
            <BaseTable {...props} {...style} />
        </div>
    );
};
