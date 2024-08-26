import axios from 'axios';
import React, { useState, useEffect } from 'react';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Table,
  Paper,
  Dialog,
  Button,
  Select,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  InputLabel,
  IconButton,
  FormControl,
  DialogContent,
  DialogActions,
  TableContainer,
} from '@mui/material';

export default function MediaAccountsTable() {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [mediaAccounts, setMediaAccounts] = useState([]);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [grantAccessModalOpen, setGrantAccessModalOpen] = useState(false);
  const [revokeAccessModalOpen, setRevokeAccessModalOpen] = useState(false); // State for revoke access modal
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedPasswordId, setSelectedPasswordId] = useState('');
  const [accessUsers, setAccessUsers] = useState([]); // State to store users with current access

  useEffect(() => {
    fetchMediaAccounts();
  }, []);

  const fetchMediaAccounts = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const agencyId = urlParams.get('agencyid');
    try {
      if (!agencyId) {
        throw new Error('No agency ID found in the URL');
      }
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${process.env.API_URL}/user/listAllPasswordByAgency`, {
        params: {
          agencyid: agencyId,
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('API response:', response.data);

      if (Array.isArray(response.data.data)) {
        setMediaAccounts(response.data.data);
      } else {
        console.error('API response does not contain an array of media accounts');
      }
    } catch (error) {
      console.error('Error fetching media accounts:', error);
    }
  };

  const fetchUsers = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const agencyId = urlParams.get('agencyid');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${process.env.API_URL}/user/listAllMember`, {
        params: {
          agencyid: agencyId,
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Users response:', response.data);

      if (Array.isArray(response.data.data)) {
        setUsers(response.data.data);
      } else {
        console.error('API response does not contain an array of users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchAccessUsers = async (passwordId) => {
    try {
      const token = localStorage.getItem('token');
      console.log(token)
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${process.env.API_URL}/user/listgrantAccessPassworduser`, {
        params: {
          passwordId,
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Access users response:', response.data);

      if (response.data.data && Array.isArray(response.data.data.access)) {
        setAccessUsers(response.data.data.access);
        setSelectedUsers(response.data.data.access.map(user => user._id)); // Initialize selectedUsers
      } else {
        console.error('API response does not contain access users');
      }
    } catch (error) {
      console.error('Error fetching access users:', error);
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage('');
  };

  const handlePlatformChange = (event) => {
    setSelectedPlatform(event.target.value);
  };

  const handlePasswordToggle = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleGrantAccessClick = async (account) => {
    setSelectedPasswordId(account._id);
    fetchUsers(); 
    setGrantAccessModalOpen(true); 
  };

  const handleRevokeAccessClick = async (account) => {
    setSelectedPasswordId(account._id);
    fetchAccessUsers(account._id); // Fetch users with access when revoke button is clicked
    setRevokeAccessModalOpen(true); 
  };

  const handleGrantAccessClose = () => {
    setGrantAccessModalOpen(false);
    setSelectedUser('');
  };

  const handleRevokeAccessClose = () => {
    setRevokeAccessModalOpen(false);
    setSelectedUsers([]);
  };

  const handleGrantAccess = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const agencyId = urlParams.get('agencyid');
      const token = localStorage.getItem('token');
      
      if (!agencyId || !token || !selectedPasswordId) {
        throw new Error('Missing parameters');
      }
      
      await axios.post(
        `${process.env.API_URL}/user/grantAccess`,
        {
          passwordId: selectedPasswordId,
          memberIds: selectedUsers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log('Access granted successfully');
      handleGrantAccessClose();
    } catch (error) {
      console.error('Error granting access:', error.message);
    }
  };

  const handleRevokeAccess = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token || !selectedPasswordId || selectedUsers.length === 0) {
        throw new Error('Missing parameters');
      }

      await axios.post(
        `${process.env.API_URL}/user/revokeAccess`, // Assuming revokeAccess endpoint
        {
          passwordId: selectedPasswordId,
          memberIds: selectedUsers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log('Access revoked successfully');
      handleRevokeAccessClose();
    } catch (error) {
      console.error('Error revoking access:', error.message);
    }
  };

  const filteredMediaAccounts = mediaAccounts.filter(account =>
    !selectedPlatform || account.platform === selectedPlatform
  );

  const handleUserSelection = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Typography variant="h6" sx={{ p: 2 }}>Media Accounts</Typography>
        <FormControl sx={{ m: 2, minWidth: 120 }}>
          <InputLabel>Platform</InputLabel>
          <Select
            value={selectedPlatform}
            onChange={handlePlatformChange}
            label="Platform"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {['Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'Snapchat', 'Airbnb', 'Booking.com', 'Expedia'].map((platform, index) => (
              <MenuItem key={index} value={platform}>{platform}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Platform</TableCell>
              <TableCell>URL</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Password</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMediaAccounts.length > 0 ? (
              filteredMediaAccounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>{account.siteName}</TableCell>
                  <TableCell>{account.siteURL}</TableCell>
                  <TableCell>{account.username}</TableCell>
                  <TableCell>
                    {passwordVisible ? account.password : '********'}
                    <IconButton onClick={handlePasswordToggle}>
                      {passwordVisible ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </TableCell>
                  <TableCell>{account.notes}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleImageClick(account.image)} style={{ padding: 0 }}>
                      <img
                        src={account.image}
                        alt={account.platform}
                        width="50"
                        height="50"
                        style={{ cursor: 'pointer' }}
                      />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleGrantAccessClick(account)} style={{ padding: 0 }}>
                      Grant access
                    </Button>
                    <Button onClick={() => handleRevokeAccessClick(account)} style={{ padding: 0 }}>
                      Revoke access
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="textSecondary">No media available</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <img src={selectedImage} alt="Selected" style={{ width: '100%' }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={grantAccessModalOpen} onClose={handleGrantAccessClose} fullWidth maxWidth="md">
        <DialogContent style={{ width: '800px', height: '600px' }}>
          <Typography variant="h6">Select Users to Grant Access</Typography>
          <div style={{ maxHeight: '500px', overflowY: 'auto', paddingTop: '10px' }}>
            {users.map((user) => (
              <div key={user._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user._id)}
                  onChange={() => handleUserSelection(user._id)}
                />
                <Typography variant="body1" style={{ marginLeft: '10px' }}>
                  {user.full_name}
                </Typography>
              </div>
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleGrantAccessClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleGrantAccess} color="primary">
            Grant Access
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={revokeAccessModalOpen} onClose={handleRevokeAccessClose} fullWidth maxWidth="md">
        <DialogContent style={{ width: '800px', height: '600px' }}>
          <Typography variant="h6">Select Users to Revoke Access</Typography>
          <div style={{ maxHeight: '500px', overflowY: 'auto', paddingTop: '10px' }}>
            {accessUsers.map((user) => (
              <div key={user._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user._id)}
                  onChange={() => handleUserSelection(user._id)}
                />
                <Typography variant="body1" style={{ marginLeft: '10px' }}>
                  {user.full_name}
                </Typography>
              </div>
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRevokeAccessClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleRevokeAccess} color="primary">
            Revoke Access
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
