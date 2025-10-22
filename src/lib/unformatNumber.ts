const unformatNumber = (number: string): number => {
    if (!number) return 0;
    return parseFloat(number.replaceAll(',', ''));
};

export default unformatNumber;
