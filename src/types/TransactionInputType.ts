export type TransactionInputType = {
    Header: {
        function: string; //'D' | 'A';
        termtype: string // 'HTS';
        trcode: string;
        trid?: string;
        userid?: string | undefined;
        token?: string | undefined;
    };
    Input1: Record<string, any>;
};
