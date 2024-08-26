import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import { Table, Paper, Button, TableRow, TableBody, TableCell, TableHead, TableContainer } from '@mui/material';

const AvailableSubscriptions = ({ onBack }) => {
  const [availableSubscriptions, setAvailableSubscriptions] = useState([]);

  const fetchAvailableSubscriptions = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${process.env.API_URL}/user/getAllPlans`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setAvailableSubscriptions(response.data.data);
    } catch (error) {
      console.error('Error fetching available subscriptions:', error);
    }
  };

  const handleSubscribe = async (subscriptionId, priceId) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(
        `${process.env.API_URL}/user/buysubscription`,
        { price_id: priceId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data && response.data.url) {
        window.location.href = response.data.url; // Redirect to the payment page
      } else {
        console.error('Invalid response data:', response.data);
      }
    } catch (error) {
      console.error('Error during subscription:', error);
    }
  };

  useEffect(() => {
    fetchAvailableSubscriptions();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Button variant="contained" color="secondary" onClick={onBack} style={{ margin: 16 }}>
        Back to My Subscriptions
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Subscription Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {availableSubscriptions.map((subscription, index) => (
            <TableRow key={index}>
              <TableCell>{subscription.name}</TableCell>
              <TableCell>{subscription.description}</TableCell>
              <TableCell>{subscription.price}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSubscribe(subscription.id, subscription.price_id)}
                >
                  Subscribe
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

AvailableSubscriptions.propTypes = {
  onBack: PropTypes.func.isRequired
};

export default AvailableSubscriptions;
