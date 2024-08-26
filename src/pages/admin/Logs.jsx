import axios from 'axios';
import React, { useState, useEffect } from 'react';

import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Paper,
  Table,
  Avatar,
  Toolbar,
  TableRow,
  Container,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  IconButton,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';

const Logs = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      // Retrieve the token from local storage or any other secure storage
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await axios.get(`${process.env.API_URL}/user/showAllLogs`, {
        headers: {
          Authorization: `Bearer ${token}` // Set the Authorization header with the token
        }
      });

      console.log('API Response:', response.data); // Debugging line
      setAuditLogs(response.data.logs || []); // Ensure you set an empty array if logs is not defined
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
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

  const filteredLogs = auditLogs.filter(log =>
    log.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.timestamp.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.ip.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>Audit Log</Typography>
        <Toolbar>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search log entry..."
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
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Brand Name</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Timestamp</TableCell>
                <TableCell>IP Address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs.length > 0 ? (
                filteredLogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(log => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'red', mr: 2 }}>{log.email.charAt(0)}</Avatar>
                        {log.email}
                      </Box>
                    </TableCell>
                    <TableCell>{log.agency ? log.agency.name : 'N/A'}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.timestamp}</TableCell>
                    <TableCell>{log.ip}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="textSecondary">No logs available</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {filteredLogs.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredLogs.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Box>
    </Container>
  );
};

export default Logs;
