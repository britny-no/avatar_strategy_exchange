export const convertDateToString = ({ date, withDash = false }) => {
    const thisYear = date.getFullYear();
    const thisMonth = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const thisDate = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const today = withDash ? `${thisYear}-${thisMonth}-${thisDate}` : `${thisYear}${thisMonth}${thisDate}`;
    return today;
};

export const getToday = () => {
    const today = new Date();
    const todayInString = convertDateToString({ date: today });
    return todayInString;
};

export const getPastday = (daysToSubtract) => {
    const pastDay = new Date(new Date().getTime() - daysToSubtract * 24 * 60 * 60 * 1000);
    const pastDayInString = convertDateToString({ date: pastDay });
    return pastDayInString;
};
