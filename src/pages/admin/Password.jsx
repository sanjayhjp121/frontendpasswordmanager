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

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../../sections/admin-table/table-no-data';
import SiteTableRow from '../../sections/admin-table/user-table-row';
import SiteTableHead from '../../sections/admin-table/user-table-head';
import TableEmptyRows from '../../sections/admin-table/table-empty-rows';
import SiteTableToolbar from '../../sections/admin-table/user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../../sections/admin-table/utils';

export default function Password() {
  const [sites, setSites] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('siteName');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [verified, setVerified] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteURL, setNewSiteURL] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [filterUser, setFilterUser] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [newUsername, setNewUsername] = useState('');


  const fetchSites = async () => {
    try {
      const response = await axios.get(`${process.env.API_URL}/member/getGrantedPasswordList`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSites(response.data.data);
    } catch (err) {
      console.error('Error fetching sites:', err);
      setError('Error fetching sites.');
    }
  };

  useEffect(() => {
    fetchSites();
  }, [page]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = sites.map((n) => n.siteName);
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

  const handleNewSite = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewSiteName('');
    setNewSiteURL('');
    setNewPassword('');
    setVerified(false);
    setFilterUser('');
    setFilteredUsers([]);
  };

  const handleCreateSite = async () => {
    const newSite = {
      siteName: newSiteName,
      siteURL: newSiteURL,
      username: newUsername,
      password: newPassword,
      email_verified: verified,
    };
  
    console.log('Creating site with data:', newSite); // Log the data to be sent
  
    try {
      const response = await axios.post(`${process.env.API_URL}/user/createPassword`, newSite, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log('Response from server:', response.data); // Log server response
  
      if (response.data.code) {
        setSites([...sites, response.data.data]);
        handleCloseDialog(); // Close the dialog after successful site creation
      }
    } catch (err) {
      console.error('Error creating site:', err);
      setError('Error creating site.');
    }
  };
  

  const handleOpenPasswordDialog = () => {
    setOpenPasswordDialog(true);
  };

  const handleSearchUser = (event) => {
    setFilterUser(event.target.value);
    const filtered = sites.filter((user) => user.full_name.toLowerCase().includes(event.target.value.toLowerCase()));
    setFilteredUsers(filtered);
  };

  const handleGrantAccess = (user) => {
    console.log('Granting access to:', user);
    // Add your logic to grant access to the user
  };

  const handleRevokeAccess = (user) => {
    console.log('Revoking access from:', user);
    // Add your logic to revoke access from the user
  };

  const dataFiltered = applyFilter({
    inputData: sites,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Sites</Typography>
        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleNewSite}>
          New Site
        </Button>
      </Stack>

      <Card>
        <SiteTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <SiteTableHead
                order={order}
                orderBy={orderBy}
                rowCount={sites.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'siteName', label: 'Site Name' },
                  { id: 'siteURL', label: 'Site URL' },
                  { id: 'password', label: 'Password' },
                  { id: 'email_verified', label: 'Verified', align: 'center' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <SiteTableRow
                      key={row.id}
                      name={row.siteName}
                      status={row.status}
                      company={row.siteURL}
                      password={row.password}
                      isVerified={row.email_verified}
                      number={row.number}
                      selected={selected.indexOf(row.siteName) !== -1}
                      onClick={(event) => handleClick(event, row.siteName)}
                      onPasswordClick={handleOpenPasswordDialog}
                    />
                  ))}

                <TableEmptyRows height={77} emptyRows={emptyRows(page, rowsPerPage, sites.length)} />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={sites.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {/* Dialog for adding new site */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New Site</DialogTitle>
        <DialogContent>
  <TextField
    autoFocus
    margin="dense"
    id="siteName"
    label="Site Name"
    type="text"
    fullWidth
    value={newSiteName}
    onChange={(e) => setNewSiteName(e.target.value)}
  />
  <TextField
    margin="dense"
    id="siteURL"
    label="Site URL"
    type="text"
    fullWidth
    value={newSiteURL}
    onChange={(e) => setNewSiteURL(e.target.value)}
  />
  <TextField
    margin="dense"
    id="username"
    label="Username"
    type="text"
    fullWidth
    value={newUsername}
    onChange={(e) => setNewUsername(e.target.value)}
  />
  <TextField
    margin="dense"
    id="password"
    label="Password"
    type="password"
    fullWidth
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
  />
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Checkbox
      checked={verified}
      onChange={(e) => setVerified(e.target.checked)}
      color="primary"
    />
    <Typography>Verified</Typography>
  </div>
</DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateSite} color="primary">
            Save
          </Button>
          <Button onClick={handleCloseDialog} color="primary">
            Exit
          </Button>
        </DialogActions>
      </Dialog>
      {error && <Typography color="error">{error}</Typography>}

      {/* Dialog for managing password */}
      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
        <DialogTitle>Manage Access</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="searchUser"
            label="Search User"
            type="text"
            fullWidth
            value={filterUser}
            onChange={handleSearchUser}
          />
          {filteredUsers.map((user) => (
            <div key={user.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0' }}>
              <Typography>{user.full_name}</Typography>
              <div>
                <Button variant="contained" color="primary" onClick={() => handleGrantAccess(user)}>Grant Access</Button>
                <Button variant="contained" color="secondary" onClick={() => handleRevokeAccess(user)}>Revoke Access</Button>
              </div>
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
