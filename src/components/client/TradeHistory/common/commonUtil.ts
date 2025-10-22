export const isSameOrderId = (data: string, orderId: string) => {
    return data.replace(/ /g, '') === orderId.replace(/ /g, '') ? true : false;
};

export const translateSzPoCode = (data) => {
    if(!data || typeof data !== 'string') return data;
    data = data.replace(' ', '');
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
    if(!data || typeof data !== 'string') return data;
    data = data.replace(/ /g, '');
    switch (data) {
        case 'UOE':
            return 'Limit';
        case 'UOM':
        case 'SOM':
            return 'Market';
        case 'SCM':
        case 'UCM':
            return 'Close';
        case 'UCEL':
            return 'Close Limit';
        case 'UCES':
            return 'Close Stop';
        case 'MOM':
            return 'Margin Call';
        case 'EOM':
            return 'Emergency Order';
        default:
            return data;
    }
};
