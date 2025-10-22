const formatNumberAbs = (numStr: number, dec: number) => {
    const result = isFinite(Number(numStr))
        ? Number(Math.abs(numStr)).toLocaleString('en-US', {
              maximumFractionDigits: dec,
              minimumFractionDigits: dec,
          })
        : '0';
    return result;
};

export default formatNumberAbs;
