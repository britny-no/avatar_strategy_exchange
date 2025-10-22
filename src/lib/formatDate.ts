export const formatTrDate = (dateObj: Date) => {
    const date = [dateObj.getFullYear(), padZero(dateObj.getMonth() + 1), padZero(dateObj.getDate())].join('-');
    const time = `${padZero(dateObj.getHours())}:${padZero(dateObj.getMinutes())}:${padZero(dateObj.getSeconds())}`;
    return `${date} ${time}`;
};

export const formatLiveDate = (szDate: string, szTime: string) => {
    const date = [szDate.slice(0, 4), szDate.slice(4, 6), szDate.slice(6)].join('-');
    const time = `${szTime.slice(0, 2)}:${szTime.slice(2, 4)}:${szTime.slice(4, 6)}`;
    return `${date} ${time}`;
};

const padZero = (num: number) => {
    return `${num < 10 ? '0' : ''}${num}`;
};

export const getToday = (): string => {
    const today = new Date();
    return convertToString(today);
};

export const convertToString = (date: Date): string => {
    const thisYear = date.getFullYear();
    const thisMonth = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const thisDate = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const today = `${thisYear}${thisMonth}${thisDate}`;
    return today;
};
