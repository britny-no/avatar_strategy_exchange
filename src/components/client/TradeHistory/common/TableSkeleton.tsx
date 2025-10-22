import { Box, CircularProgress } from '@mui/material';

interface PropsType {
    style: Record<string, any>;
}

const TableSkeleton = ({ style }: PropsType) => {
    return (
        <Box alignItems="center" justifyContent="center" style={style}>
            <CircularProgress />
        </Box>
    );
};

export default TableSkeleton;
