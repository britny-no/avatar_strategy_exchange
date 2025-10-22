export const isSameOrderId = (data: string, orderId: string) => {
    return data.replace(/ /g, '') === orderId.replace(/ /g, '') ? true : false;
};

export const translateSzPoCode = (data) => {
    data = data.replace(/ /g, '');
    switch (data) {
        case '079':
            return 'Buy';
        case '080':
            return 'Close Sell';
        case '081':
            return 'Sell';
        case '082':
            return 'Close Buy';
        default:
            return data;
    }
};

export const translateOrderType = (data) => {
    data = data.replace(/ /g, '');
    switch (data) {
        case 'UOE':
            return 'Limit';
        case 'UOM':
            return 'Market';
        case 'SCM':
            return 'Close';
        default:
            return data;
    }
};
