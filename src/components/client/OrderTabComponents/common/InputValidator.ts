// export const NewOrderInputValidator = (input) => {
//     if (input.szDealDiv !== '081' && input.szDealDiv !== '079') {
//         alert('szDealDiv of new order is neither 079 or 081');
//         return false;
//     }
//     if (input.szOrdType !== 'UOM' && input.szOrdType !== 'UOE') {
//         alert('szDealDiv of new order is neither UOM or UOE');
//         return false;
//     }

//     if (Number(input.fOrderSu) <= 0 && 99999999 < Number(input.fOrderSu)) {
//         alert('fOrderSu of new order is not number');
//         return false;
//     }

//     if (input.fOrderPrice===undefined || Number(input.fOrderPrice)<=0 ||isNaN(input.fOrderPrice)) {
//         setPriceError(TRANSLATOR.PRICE_ERROR(language) as string);
//         isValid = false;
//     }
//     if (!input.fOrderSu) {
//         setSumError(TRANSLATOR.AMOUNT_ERROR(language) as string);
//         isValid = false;
//     }
//     if (!input.szOrdType) {
//         setOrderTypeError(TRANSLATOR.ORDER_TYPE_ERROR(language) as string);
//         isValid = false;
//     }

//     return true;
// };

// export const ModifyCancelEntryInputValidator = (input) => {
//     if (input.szDealDiv !== '081' && input.szDealDiv !== '079') {
//         alert('szDealDiv of new order is neither 079 or 081');
//         return false;
//     }
//     if (input.szOrdType !== 'UOM' && input.szOrdType !== 'UOE') {
//         alert('szDealDiv of new order is neither UOM or UOE');
//         return false;
//     }

//     if (Number(input.fOrderSu) <= 0 && 99999999 < Number(input.fOrderSu)) {
//         alert('fOrderSu of new order is not number');
//         return false;
//     }

//     return true;
// };

export {};
