import React, { useState, useEffect } from 'react';

import {
  Grid,
  Card,
  Alert,
  Button,
  Snackbar,
  Container,
  TextField,
  Typography,
  CardContent,
  CardActions,
} from '@mui/material';

const PaymentModel = () => {
  const [basicPrice, setBasicPrice] = useState(10);
  const [miniPrice, setMiniPrice] = useState(20);
  const [agencyPrice, setAgencyPrice] = useState(30);
  const [basicDescription, setBasicDescription] = useState(
    'Ideal for small teams with basic project management needs.'
  );
  const [miniDescription, setMiniDescription] = useState(
    'Great for medium-sized teams looking for more features.'
  );
  const [agencyDescription, setAgencyDescription] = useState(
    'Perfect for agency with advanced project management requirements.'
  );
  const [basicFeatures, setBasicFeatures] = useState('Task management, basic reporting, up to 10 team members.');
  const [miniFeatures, setMiniFeatures] = useState('Task management, advanced reporting, up to 25 team members.');
  const [agencyFeatures, setAgencyFeatures] = useState('Task management, custom reporting, unlimited team members.');
  const [basicDuration, setBasicDuration] = useState(1); // duration in months
  const [miniDuration, setMiniDuration] = useState(1);  // duration in months
  const [agencyDuration, setAgencyDuration] = useState(1);  // duration in months

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      setBasicPrice(10);
      setMiniPrice(20);
      setAgencyPrice(30);
      setBasicDescription('Ideal for small teams with basic project management needs.');
      setMiniDescription('Great for medium-sized teams looking for more features.');
      setAgencyDescription('Perfect for agency with advanced project management requirements.');
      setBasicFeatures('Task management, basic reporting, up to 10 team members.');
      setMiniFeatures('Task management, advanced reporting, up to 25 team members.');
      setAgencyFeatures('Task management, custom reporting, unlimited team members.');
      setBasicDuration(1);
      setMiniDuration(1);
      setAgencyDuration(1);
    } catch (err) {
      console.error('Error fetching prices:', err);
      setErrorMessage('Error fetching prices.');
    }
  };

  const handleSave = async (planType) => {
    let price;
    let description;
    let productName;
    let duration;
    let features;

    switch(planType) {
      case 'basic':
        price = basicPrice;
        description = basicDescription;
        productName = "Basic Plan";
        duration = basicDuration;
        features = basicFeatures;
        break;
      case 'mini':
        price = miniPrice;
        description = miniDescription;
        productName = "Mini Plan";
        duration = miniDuration;
        features = miniFeatures;
        break;
      case 'agency':
        price = agencyPrice;
        description = agencyDescription;
        productName = "Agency Plan";
        duration = agencyDuration;
        features = agencyFeatures;
        break;
      default:
        return;
    }

    const priceGroupData = {
      name: productName,
      price,
      description,
      duration,
      features
    };

    try {
      const response = await fetch(`${process.env.API_URL}/admin/createPriceGroup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(priceGroupData),
      });

      if (response.ok) {
        setSuccessMessage('Prices updated successfully!');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Error updating prices.');
      }
    } catch (err) {
      console.error('Error updating prices:', err);
      setErrorMessage('Error updating prices.');
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Set Plan Prices
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Basic Plan
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                {basicDescription}
              </Typography>
              <TextField
                label="Price"
                variant="outlined"
                fullWidth
                value={basicPrice}
                onChange={(e) => setBasicPrice(e.target.value)}
                sx={{ mt: 2 }}
              />
              <TextField
                label="Duration (Months)"
                variant="outlined"
                fullWidth
                value={basicDuration}
                onChange={(e) => setBasicDuration(e.target.value)}
                sx={{ mt: 2 }}
              />
              <TextField
                label="Features"
                variant="outlined"
                fullWidth
                value={basicFeatures}
                onChange={(e) => setBasicFeatures(e.target.value)}
                sx={{ mt: 2 }}
              />
            </CardContent>
            <CardActions>
              <Button variant="contained" color="primary" onClick={() => handleSave('basic')} fullWidth>
                Save
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Mini Plan
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                {miniDescription}
              </Typography>
              <TextField
                label="Price"
                variant="outlined"
                fullWidth
                value={miniPrice}
                onChange={(e) => setMiniPrice(e.target.value)}
                sx={{ mt: 2 }}
              />
              <TextField
                label="Duration (Months)"
                variant="outlined"
                fullWidth
                value={miniDuration}
                onChange={(e) => setMiniDuration(e.target.value)}
                sx={{ mt: 2 }}
              />
              <TextField
                label="Features"
                variant="outlined"
                fullWidth
                value={miniFeatures}
                onChange={(e) => setMiniFeatures(e.target.value)}
                sx={{ mt: 2 }}
              />
            </CardContent>
            <CardActions>
              <Button variant="contained" color="primary" onClick={() => handleSave('mini')} fullWidth>
                Save
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Agency Plan
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                {agencyDescription}
              </Typography>
              <TextField
                label="Price"
                variant="outlined"
                fullWidth
                value={agencyPrice}
                onChange={(e) => setAgencyPrice(e.target.value)}
                sx={{ mt: 2 }}
              />
              <TextField
                label="Duration (Months)"
                variant="outlined"
                fullWidth
                value={agencyDuration}
                onChange={(e) => setAgencyDuration(e.target.value)}
                sx={{ mt: 2 }}
              />
              <TextField
                label="Features"
                variant="outlined"
                fullWidth
                value={agencyFeatures}
                onChange={(e) => setAgencyFeatures(e.target.value)}
                sx={{ mt: 2 }}
              />
            </CardContent>
            <CardActions>
              <Button variant="contained" color="primary" onClick={() => handleSave('agency')} fullWidth>
                Save
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PaymentModel;
