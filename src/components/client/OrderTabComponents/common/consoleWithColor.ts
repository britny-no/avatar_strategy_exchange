export const consoleLogWithColor = (message: string, inputToSend: Record<string, any>) => {
    console.log(`%c${message}`, 'background: #222; color: #bada55', inputToSend);
};
export const consoleWarnWithColor = (message: string) => {
    console.log(`%c${message}`, 'background: #222;color: #dd413b');
};
