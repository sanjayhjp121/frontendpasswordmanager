import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { Box, Paper, Button, Divider, Typography, CircularProgress } from '@mui/material';

import MediaAccountsTable from './MediaAccountsTable';

const ClientDetails = () => {
  const [client, setClient] = useState(null);
  const [mediaAccounts, setMediaAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const urlObject = new URL(window.location.href);
  const agencyId = urlObject.searchParams.get('agencyid');

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        // Fetch client details (replace with your actual client details endpoint if needed)
        const clientResponse = await axios.get(`${process.env.API_URL}/user/listAllPasswordByAgency`, {
          params: { agencyid: agencyId },
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setClient(clientResponse.data.data); // Adjust this based on actual response structure

        // Fetch media accounts related to the client
        const mediaResponse = await axios.get(`${process.env.API_URL}/user/listAllPasswordByAgency`, {
          params: { agencyid: agencyId },
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setMediaAccounts(mediaResponse.data.data); // Adjust this based on actual response structure
      } catch (err) {
        console.error('Error fetching client details or media accounts:', err);
        setError('Error fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchClientDetails();
  }, [agencyId]);

  const handleCreateMediaAccount = () => {
    navigate(`/mediaform?agencyid=${agencyId}`);
  };  

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
          Client Details: {client ? client.name : 'Loading...'}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
          Media Accounts
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateMediaAccount}
          sx={{ mb: 3 }}
        >
          Add Media
        </Button>
        <MediaAccountsTable mediaAccounts={mediaAccounts} />
      </Paper>
    </Box>
  );
};

export default ClientDetails;
