import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";

const StyledBadgeOffline = styled(Badge)(({theme}) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#605e5e',
        color: '#605e5e',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
        },
    },

}));

export default StyledBadgeOffline