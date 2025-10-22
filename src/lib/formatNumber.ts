// 전일종가 0일때 0으로 나누다보니 Infinity 발생
// 그럴땐 그냥 0을 리턴해도록
const formatNumber = (numStr: number | string | undefined, dec = 0) => {
    if (numStr === undefined) return '0';

    if (Number(numStr) < 1) {
        return Number(numStr).toFixed(dec) + '';
    }

    const result = isFinite(Number(numStr))
        ? Number(numStr).toLocaleString('en-US', {
              maximumFractionDigits: dec,
              minimumFractionDigits: dec,
          })
        : '0';
    return result;
};

export default formatNumber;
