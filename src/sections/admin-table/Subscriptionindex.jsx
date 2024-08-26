// /pages/index.js
import React from 'react';

import { Container } from '@mui/material';

import SubscriptionList from './Subscriptionpage';
import AvailableSubscriptions from './SubscriptionForm';

export default function Subscriptionindex() {
  const [view, setView] = React.useState('list'); // 'list' or 'available'

  const handleAddSubscription = () => {
    setView('available');
  };

  const handleBackToList = () => {
    setView('list');
  };

  return (
    <Container>
      {view === 'list' ? (
        <SubscriptionList onAddSubscription={handleAddSubscription} />
      ) : (
        <AvailableSubscriptions onBack={handleBackToList} />
      )}
    </Container>
  );
}
