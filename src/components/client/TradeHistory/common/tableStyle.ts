const getMaxWidth = () => {
    // return window.innerWidth - 439;
    // console.log(' window.innerWidth:', window.innerWidth, ' return value : ', window.innerWidth - 442);
    return window.innerWidth - 445;
};

export const style = {
    maxWidth: getMaxWidth(),
    // maxWidth: 800,
    // minWidth: getMaxWidth(),
    // maxWidth: '100%',
    // minWidth: '100%',
    // minWidth: 1006,
    // maxWidth: 1006,
    maxHeight: 385,
    rowHeight: 47,
};

export const mobileStyle = {
    maxWidth: '100%',
    maxHeight: '100%',
    rowHeight: 40,
};
