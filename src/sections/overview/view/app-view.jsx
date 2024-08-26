import axios from 'axios';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { grey } from '@mui/material/colors';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import LockIcon from '@mui/icons-material/Lock';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import GroupIcon from '@mui/icons-material/Group';
import CardContent from '@mui/material/CardContent';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';

import AppCurrentVisits from '../app-current-visits';
import AppWidgetSummary from '../app-widget-summary';

// Define the features array outside the component for readability
const features = [
  {
    title: "PASSWORD MANAGER",
    description: "A password manager contains your clients and media accounts. You can create unlimited numbers of clients, media accounts and add unlimited users with roles as admin or member.",
    icon: <LockIcon />
  },
  {
    title: "MEDIA ACCOUNT",
    description: "Media Account is the building block of the Password Manager. You can add one account credential per Media Account. Your sensitive information in the Media Account is stored encrypted.",
    icon: <AccountCircleIcon />
  },
  {
    title: "CLIENT",
    description: "Clients are a group of media accounts. You can arrange the media accounts with client names in order to have a well-managed access.",
    icon: <GroupIcon />
  },
  {
    title: "SUBSCRIPTION",
    description: "Subscription contains your subscription details for a Password Manager. A Password Manager requires an active subscription.",
    icon: <SubscriptionsIcon />
  }
];

export default function AppView() {
  const [data, setData] = useState({
    agencyCount: 0,
    userCount: 0,
    passwordCount: 0,
    vaultCount: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.API_URL}/user/dashboard`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // or wherever you're storing the auth token
          }
        });

        setData({
          agencyCount: response.data.agency || 0,
          userCount: response.data.user || 0,
          passwordCount: response.data.password || 0,
          vaultCount: response.data.vault || 0
        });
      } catch (error) {
        console.error('Error fetching data', error);
        setData({
          agencyCount: 0,
          userCount: 0,
          passwordCount: 0,
          vaultCount: 0
        });
      }
    };

    fetchData();
  }, []);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Passwords"
            total={data.passwordCount || '0'}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Total Users"
            total={data.userCount || '0'}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Agencies"
            total={data.agencyCount || '0'}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Vaults"
            total={data.vaultCount || '0'}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <Card>
            <CardHeader title="Get Started" />
            <CardContent>
              <Grid container spacing={2} sx={{ borderTop: `1px solid ${grey[300]}`, borderLeft: `1px solid ${grey[300]}` }}>
                {features.map((feature, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    key={index}
                    sx={{
                      borderBottom: `1px solid ${grey[300]}`,
                      borderRight: `1px solid ${grey[300]}`
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                      <Box sx={{ mr: 2 }}>{feature.icon}</Box>
                      <Box>
                        <Typography variant="h6" sx={{ color: grey[800], mb: 1 }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: grey[600] }}>
                          {feature.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title="Current Visits"
            chart={{
              series: [
                { label: 'Agencies', value: data.agencyCount },
                { label: 'Passwords', value: data.passwordCount },
                { label: 'Users', value: data.userCount },
                { label: 'Vaults', value: data.vaultCount },
              ],
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
