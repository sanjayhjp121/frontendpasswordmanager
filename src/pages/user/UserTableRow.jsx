import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function UserTableRow({
  selected,
  full_name,
  email,
  phone_number,
  company_name,
  email_verified,
  status,
  handleClick,
  isPasswordVisible,
  onTogglePasswordVisibility
}) {
  return (
    <TableRow
      hover
      tabIndex={-1}
      role="checkbox"
      selected={selected}
      style={{ cursor: 'pointer' }}
      onClick={handleClick}
    >
      <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
        <Checkbox disableRipple checked={selected} onChange={() => {}} />
      </TableCell>

      <TableCell component="th" scope="row" padding="none">
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar alt={full_name} src="" /> {/* Add avatar URL here if needed */}
          <Typography variant="subtitle2" noWrap>
            {full_name}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell>{email}</TableCell>
      <TableCell>{phone_number}</TableCell>
      <TableCell>
        {isPasswordVisible ? (
          <Typography>{company_name}</Typography>
        ) : (
          <Typography>••••••••</Typography>
        )}
        <IconButton onClick={(e) => { e.stopPropagation(); onTogglePasswordVisibility(); }}>
          {isPasswordVisible ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </TableCell>
      <TableCell align="center">{email_verified ? 'Yes' : 'No'}</TableCell>
      <TableCell>{status}</TableCell>
    </TableRow>
  );
}

UserTableRow.propTypes = {
  full_name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  phone_number: PropTypes.string.isRequired,
  company_name: PropTypes.string,
  email_verified: PropTypes.bool.isRequired,
  status: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  isPasswordVisible: PropTypes.bool.isRequired,
  onTogglePasswordVisibility: PropTypes.func.isRequired
};
