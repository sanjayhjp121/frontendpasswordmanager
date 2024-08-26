import axios from 'axios';
import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import Scrollbar from 'src/components/scrollbar';

import SuperAdminTableRow from './SuperAdminTableRow';
import TableNoData from '../../sections/admin-table/table-no-data';
import UserTableHead from '../../sections/admin-table/user-table-head';
import TableEmptyRows from '../../sections/admin-table/table-empty-rows';
import UserTableToolbar from '../../sections/admin-table/user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../../sections/admin-table/utils';

export default function TotalAdmins() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('full_name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [verified, setVerified] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserStatus, setNewUserStatus] = useState('active');
  const [error, setError] = useState(null);
  const [newEmail, setNewEmail] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [plan, setPlan] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${process.env.API_URL}/admin/getUserList`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUsers(response.data.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Error fetching users.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.full_name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewUserName('');
    setVerified(false);
    setNewUserStatus('active');
    setPhoneNumber('');
    setNewEmail('');
    setPlan('');
  };

  const handlePlanClick = (planName) => {
    setPlan(planName);
  };

  const handleSaveNewAdmin = async () => {
    try {
      const newAdmin = {
        full_name: newUserName,
        email: newEmail,
        phone_number,
        email_verified: verified,
        status: newUserStatus,
        plan,
      };

      await axios.post(`${process.env.API_URL}/admin/addUser`, newAdmin, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      fetchUsers();
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving new admin:', err);
      setError('Error saving new admin.');
    }
  };

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Admins</Typography>
      </Stack>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={users.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'full_name', label: 'Name' },
                  { id: 'email', label: 'Email' },
                  { id: 'email_verified', label: 'Verified', align: 'center' },
                  { id: 'status', label: 'Status' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <SuperAdminTableRow
                      key={row.id}
                      full_name={row.full_name}
                      email={row.email}
                      email_verified={row.email_verified}
                      status={row.status}
                      profile_image={row.profile_image}
                      selected={selected.indexOf(row.full_name) !== -1}
                      handleClick={(event) => handleClick(event, row.full_name)}
                    />
                  ))}

                <TableEmptyRows height={77} emptyRows={emptyRows(page, rowsPerPage, users.length)} />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {/* Dialog for adding new admin */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New Admin</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
          />
          <TextField
            margin="dense"
            id="phone_number"
            label="Phone Number"
            type="text"
            fullWidth
            value={phone_number}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <TextField
            margin="dense"
            id="email"
            label="Email"
            type="email"
            fullWidth
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
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
          <div style={{ display: 'flex', justifyContent: 'space-around', margin: '5px 0'}}>
            <Button onClick={() => handlePlanClick('Basic')} style={{border: '1px dashed gray' }}>Basic</Button>
            <Button onClick={() => handlePlanClick('Mini')} style={{border: '1px dashed gray' }}>Mini</Button>
            <Button onClick={() => handlePlanClick('Agency')} style={{border: '1px dashed gray' }}>Agency</Button>
          </div>
          <TextField
            margin="dense"
            id="plan"
            label="Plan"
            type="text"
            fullWidth
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveNewAdmin} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {error && <Typography color="error">{error}</Typography>}
    </Container>
  );
}
