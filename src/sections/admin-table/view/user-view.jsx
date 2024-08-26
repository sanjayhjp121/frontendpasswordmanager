import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import {
  Card,
  Stack,
  Table,
  Button,
  Dialog,
  Checkbox,
  TableRow,
  Container,
  TableBody,
  TextField,
  TableCell,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  TablePagination,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import { emptyRows, applyFilter, getComparator } from '../utils';

const generateRandomPassword = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < 8; i+1) { // Use `i++` instead of `i+1`
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};


export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('full_name');
  const [filterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [verified, setVerified] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [newUserStatus, setNewUserStatus] = useState('active');
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openMediaDialog, setOpenMediaDialog] = useState(false);
  const [mediaName, setMediaName] = useState(''); // Placeholder state for media
  const [password, setPassword] = useState('');
  const [loadingPassword] = useState(false);
  const navigate = useNavigate();

  const urlObject = new URL(window.location.href);
  const [agencyId] = useState(urlObject.searchParams.get('agencyid'));

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.API_URL}/user/listAllMember`, {
        params: {
          agencyid: agencyId, // Send agencyId as a query parameter
        },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUsers(response.data.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Error fetching users.');
    }
  }, [agencyId]); // Add agencyId to the dependency array


  useEffect(() => {
    fetchUsers();
  }, [page, fetchUsers]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.full_name);
      setSelected(newSelecteds);
    } else {
      setSelected([]);
    }
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = [...selected, name];
    } else if (selectedIndex === 0) {
      newSelected = selected.slice(1);
    } else if (selectedIndex === selected.length - 1) {
      newSelected = selected.slice(0, -1);
    } else if (selectedIndex > 0) {
      newSelected = [
        ...selected.slice(0, selectedIndex),
        ...selected.slice(selectedIndex + 1),
      ];
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleNewUser = () => {
    setOpenDialog(true);
    setPassword(generateRandomPassword()); // Ensure this function runs quickly
  };  

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setNewUserName('');
    setNewEmail('');
    setPhoneNumber('');
    setVerified(false);
    setNewUserStatus('active');
    setError(null);
    setPassword(''); // Reset password on dialog close
  }, []);

  const handleCreateUser = useCallback(async () => {
    const newUser = {
      full_name: newUserName,
      email: newEmail,
      phone_number: phoneNumber,
      email_verified: verified,
      status: newUserStatus,
      password,
      agencyId,
    };

    try {
      console.log('Creating user:', newUser);
      const response = await axios.post(`${process.env.API_URL}/user/createMember`, newUser, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (response.data.code === 200) {
        console.log('User created:', response.data.data);
        setUsers(prevUsers => [...prevUsers, response.data.data]);
        handleCloseDialog();
      } else {
        setError('Error creating user.');
      }
    } catch (err) {
      console.error('Error creating user:', err);
      setError('Error creating user.');
    }
  }, [newUserName, newEmail, phoneNumber, verified, newUserStatus, password, agencyId, handleCloseDialog]);

  const handleNewMedia = () => {
    navigate(`/clientinfo?agencyid=${agencyId}`);
  };
  

  const handleCloseMediaDialog = () => {
    setOpenMediaDialog(false);
    setMediaName('');
  };

  const handleCreateMedia = async () => {
    // Implement the function to create a new media entry
    // You can use `axios.post` similar to the `handleCreateUser` function
  };

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const filteredUsers = dataFiltered.filter(user =>
    (user.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.phone_number || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Users</Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleNewUser}>
            New User
          </Button>
          <Button variant="contained" color="inherit" onClick={handleNewMedia}>
            View Media
          </Button>
        </Stack>
      </Stack>

      <Card>
        <Stack spacing={2} p={2}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <Iconify icon="eva:search-outline" />,
            }}
          />
        </Stack>

        <Scrollbar>
          <TableContainer>
            <Table>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                headLabel={[
                  { id: 'full_name', label: 'Full Name' },
                  { id: 'email', label: 'Email' },
                  { id: 'email_verified', label: 'Verified', align: 'center' },
                  { id: 'phone_number', label: 'Phone Number' },
                  { id: '' },
                ]}
                rowCount={users.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <UserTableRow
                      key={row.full_name}
                      full_name={row.full_name}
                      email={row.email}
                      phone_number={row.phone_number}
                      email_verified={row.email_verified}
                      status={row.status}
                      selected={selected.indexOf(row.full_name) !== -1}
                      handleClick={(event) => handleClick(event, row.full_name)}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="subtitle1">No Users Available</Typography>
                    </TableCell>
                  </TableRow>
                )}
                <TableEmptyRows height={53} emptyRows={emptyRows(page, rowsPerPage, users.length)} />
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Full Name"
            type="text"
            fullWidth
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
          />
          <TextField
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            id="number"
            label="Phone Number"
            type="text"
            fullWidth
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
              checked={verified}
              onChange={(e) => setVerified(e.target.checked)}
              color="primary"
            />
            <Typography>Verified</Typography>
          </div>
          <TextField
            margin="dense"
            id="status"
            label="Status"
            type="text"
            fullWidth
            value={newUserStatus}
            onChange={(e) => setNewUserStatus(e.target.value)}
          />
          <TextField
            margin="dense"
            id="password"
            label="Password"
            type="text"
            fullWidth
            value={password}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <IconButton onClick={() => setPassword(generateRandomPassword())} disabled={loadingPassword}>
                  <Iconify icon="eva:refresh-fill" />
                </IconButton>
              ),
            }}
            helperText={loadingPassword ? 'Generating...' : 'Click refresh to generate a new password'}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateUser} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openMediaDialog} onClose={handleCloseMediaDialog}>
        <DialogTitle>Create New Media</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="mediaName"
            label="Media Name"
            type="text"
            fullWidth
            value={mediaName}
            onChange={(e) => setMediaName(e.target.value)}
          />
          {/* Add additional fields as needed */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMediaDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateMedia} color="primary">
            Save
          </Button>
          <Button onClick={handleCloseMediaDialog} color="primary">
            Exit
          </Button>
        </DialogActions>
      </Dialog>

      {error && <Typography color="error">{error}</Typography>}
    </Container>
  );
}
