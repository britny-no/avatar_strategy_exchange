export const getToday = (): string => {
    const today = new Date();
    return convertToString(today);
};

export const getPastday = (daysToSubtract): string => {
    const pastDay = new Date(new Date().getTime() - daysToSubtract * 24 * 60 * 60 * 1000);
    return convertToString(pastDay);
};

export const convertToString = (date: Date): string => {
    const thisYear = date.getFullYear();
    const thisMonth = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const thisDate = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const today = `${thisYear}${thisMonth}${thisDate}`;
    return today;
};
