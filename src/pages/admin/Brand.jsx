import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import SearchIcon from '@mui/icons-material/Search';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from 'src/sections/admin-table/table-no-data';
import BrandTableRow from 'src/sections/admin-table/brand-table-row';
import BrandTableHead from 'src/sections/admin-table/user-table-head';
import TableEmptyRows from 'src/sections/admin-table/table-empty-rows';
// import BrandTableToolbar from 'src/sections/admin-table/user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from 'src/sections/admin-table/utils';

export default function AgencyPage() {
  const [agencies, setAgencies] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [error, setError] = useState(null);
  const [openClientDialog, setOpenClientDialog] = useState(false);
  const [newAgencyName, setNewAgencyName] = useState('');
  const [newAgencyDescription, setNewAgencyDescription] = useState('');
  const [newAgencyCompanyName, setNewAgencyCompanyName] = useState('');
  const [newAgencyAddress, setNewAgencyAddress] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchAgencies = async () => {
    // const { agencyId } = useParams()
    try {
      const response = await axios.get(`${process.env.API_URL}/user/listAllAgency`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log('API Response:', response.data.data); 
      setAgencies(response.data.data);
    } catch (err) {
      console.error('Error fetching agencies:', err);
      setError('Error fetching agencies.');
    }
  };

  useEffect(() => {
    fetchAgencies();
  }, [page]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = agencies.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name, id) => {
    console.log('Clicked - Name:', name, 'ID:', id);
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
    navigate(`/adduser/${id}`);
  };
  

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  // const handleFilterByName = (event) => {
  //   setPage(0);
  //   setFilterName(event.target.value);
  // };

  const handleNewClient = () => {
    setOpenClientDialog(true);
  };

  const handleCloseClientDialog = () => {
    setOpenClientDialog(false);
    setNewAgencyName('');
    setNewAgencyDescription('');
    setNewAgencyCompanyName('');
    setNewAgencyAddress('');
  };

  const handleCreateClient = async () => {
    const newAgency = {
      name: newAgencyName,
      description: newAgencyDescription,
      company_name: newAgencyCompanyName,
      company_address: newAgencyAddress,
    };

    console.log('Creating agency with data:', newAgency);

    try {
      const response = await axios.post(`${process.env.API_URL}/user/createAgency`, newAgency, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log('Response from server:', response.data);
      fetchAgencies(); // Refresh agencies list
      handleCloseClientDialog(); // Close dialog after creation
    } catch (err) {
      console.error('Error creating agency:', err);
      setError('Error creating agency.');
    }
  };

  const dataFiltered = applyFilter({
    inputData: agencies,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredAgencies = dataFiltered.filter(agency =>
    agency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agency.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agency.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agency.company_address.toLowerCase().includes(searchQuery.toLowerCase())
  );
  console.log('Filtered Agencies:', filteredAgencies);
  const notFound = !filteredAgencies.length && !!searchQuery;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Agencies</Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleNewClient}>
            New Agency
          </Button>
        </Stack>
      </Stack>

      <Card>
        <Toolbar>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              endAdornment: (
                <IconButton>
                  <SearchIcon />
                </IconButton>
              ),
            }}
            sx={{ width: 400 }}
          />
        </Toolbar>

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <BrandTableHead
                order={order}
                orderBy={orderBy}
                rowCount={agencies.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'description', label: 'Description' },
                  { id: 'company_name', label: 'Company Name', align: 'center' },
                  { id: 'company_address', label: 'Address' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {filteredAgencies
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <BrandTableRow
                    key={row._id}
                    name={row.name}
                    description={row.description}
                    company={row.company_name}
                    address={row.company_address}
                    selected={selected.indexOf(row.name) !== -1}
                    _id={row._id} // Ensure _id is passed as a prop
                    onClick={(event) => handleClick(event, row.name, row._id)}
                  />                  
                  ))}

                <TableEmptyRows height={77} emptyRows={emptyRows(page, rowsPerPage, agencies.length)} />

                {notFound && <TableNoData query={searchQuery} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={agencies.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {/* Dialog for adding new agency */}
      <Dialog open={openClientDialog} onClose={handleCloseClientDialog}>
        <DialogTitle>Add New Agency</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            value={newAgencyName}
            onChange={(e) => setNewAgencyName(e.target.value)}
          />
          <TextField
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            value={newAgencyDescription}
            onChange={(e) => setNewAgencyDescription(e.target.value)}
          />
          <TextField
            margin="dense"
            id="company_name"
            label="Company Name"
            type="text"
            fullWidth
            value={newAgencyCompanyName}
            onChange={(e) => setNewAgencyCompanyName(e.target.value)}
          />
          <TextField
            margin="dense"
            id="company_address"
            label="Company Address"
            type="text"
            fullWidth
            value={newAgencyAddress}
            onChange={(e) => setNewAgencyAddress(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseClientDialog}>Cancel</Button>
          <Button onClick={handleCreateClient}>Save</Button>
        </DialogActions>
      </Dialog>

      {error && <Typography color="error">{error}</Typography>}
    </Container>
  );
}
