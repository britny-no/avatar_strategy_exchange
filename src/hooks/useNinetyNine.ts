import { useSelector } from 'react-redux';
import { useTypedSelector } from '../states/useTypedSelector';
import useAgentWhenSignedIn from './useAgentWhenSignedIn';

const outputOneColumn = [
    'szkey',
    'szEntryPrc',
    'szStopPrc',
    'szLimitPrc',
    'szOrgCustItem1',
    'szOrgCustItem2',
    'szOorgCustItem3',
    'szCustItem1',
    'szCustItem2',
    'szCustItem3',
    'cStatus',
    'szAccNo',
];

const useData = () => {
    const liveResult = useTypedSelector((state) => state.stateReducer[`99`]);

    const convertObjToArray = (arr) => {
        return arr.map((obj) => Object.values(obj.Output1));
    };

    return {
        data: liveResult && liveResult.length > 0 ? convertObjToArray(liveResult) : [],
        dataColumn: outputOneColumn,
    };
};

export default useData;
