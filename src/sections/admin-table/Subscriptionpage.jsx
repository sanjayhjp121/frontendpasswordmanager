import axios from 'axios';
import React, { useState, useEffect } from 'react';

import { Table, Paper, Button, TableRow, TableBody, TableCell, TableHead, Typography, TableContainer } from '@mui/material';

import AvailableSubscriptions from './SubscriptionForm'; // Import the new component

const SubscriptionList = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [showAvailable, setShowAvailable] = useState(false);

  const fetchSubscriptions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await axios.get(`${process.env.API_URL}/user/getMySubscriptions`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Ensure response.data and response.data.data are not null
      if (response.data && response.data.data) {
        setSubscriptions(response.data.data);
      } else {
        console.error('Invalid response structure:', response.data);
        setSubscriptions([]);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      setSubscriptions([]);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleAddSubscription = () => {
    setShowAvailable(true);
  };

  const handleBack = () => {
    setShowAvailable(false);
  };

  if (showAvailable) {
    return <AvailableSubscriptions onBack={handleBack} />;
  }

  return (
    <TableContainer component={Paper}>
      <Button variant="contained" color="primary" onClick={handleAddSubscription} style={{ margin: 16 }}>
        Add New Subscription
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Subscription Name</TableCell>
            <TableCell>Purchased Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Subscription Time Period</TableCell>
            <TableCell>Plan</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(subscriptions) && subscriptions.length > 0 ? (
            subscriptions.map((subscription, index) => (
              <TableRow key={index}>
                <TableCell>{subscription.name}</TableCell>
                <TableCell>{subscription.purchasedDate}</TableCell>
                <TableCell>{subscription.endDate}</TableCell>
                <TableCell>{subscription.timePeriod}</TableCell>
                <TableCell>{subscription.plan}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="textSecondary">No subscriptions available</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SubscriptionList;
