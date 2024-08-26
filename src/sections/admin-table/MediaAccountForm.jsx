import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import React, { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { Box, Button, Select, MenuItem, TextField, Typography, InputLabel, FormControl } from '@mui/material';

const initialPlatforms = [
  { name: 'Facebook', logo: 'https://via.placeholder.com/24?text=FB' },
  { name: 'Twitter', logo: 'https://via.placeholder.com/24?text=TW' },
  { name: 'Instagram', logo: 'https://via.placeholder.com/24?text=IG' },
  { name: 'LinkedIn', logo: 'https://via.placeholder.com/24?text=LI' },
  { name: 'Snapchat', logo: 'https://via.placeholder.com/24?text=SC' },
  { name: 'Airbnb', logo: 'https://via.placeholder.com/24?text=AB' },
  { name: 'Booking.com', logo: 'https://via.placeholder.com/24?text=BC' },
  { name: 'Expedia', logo: 'https://via.placeholder.com/24?text=EX' },
  // Add more platforms and their logos as needed
];

const MediaAccountForm = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const agencyId = queryParams.get('agencyid'); // Retrieve agencyId from query params

  const [formValues, setFormValues] = useState({
    platform: '',
    email: '',
    username: '',
    password: '',
    notes: '',
    image: '',
    FA_phone: '',
    FA_App: '',
    Recovery_Email: '',
    Backup_Codes: '',
    newPlatform: '', // State to hold the new platform value
    siteName: '', // Add siteName field
    siteURL: '',  // Add siteURL field
    agencyId: agencyId || '' // Set agencyId from query params, default to empty string if not available
  });

  const [platforms, setPlatforms] = useState(initialPlatforms); // State for platforms
  const [isAddingPlatform, setIsAddingPlatform] = useState(false); // Toggle for adding new platform

  const navigate = useNavigate(); // Get the navigate function

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handlePlatformChange = (event) => {
    setFormValues({ ...formValues, platform: event.target.value });
  };

  const handleAddPlatform = () => {
    if (formValues.newPlatform.trim() !== '') {
      const newPlatform = {
        name: formValues.newPlatform,
        logo: 'https://via.placeholder.com/24?text=NP' // Placeholder logo for new platform
      };
      setPlatforms([...platforms, newPlatform]);
      setFormValues({ ...formValues, platform: formValues.newPlatform, newPlatform: '' });
      setIsAddingPlatform(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Logic to save media account data
    console.log('Form Submitted', formValues);

    try {
      const token = localStorage.getItem('token'); // Get the token from localStorage
      const response = await axios.post(
        `${process.env.API_URL}/user/createPassword`,
        formValues,
        {
          headers: {
            Authorization: `Bearer ${token}` // Pass the token in the Authorization header
          }
        }
      );
      alert(response.data.message);
      navigate('/clientinfo'); // Redirect to clientinfo route
    } catch (error) {
      console.error('Error in form submission:', error);
      alert('Error saving media account details');
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = () => {
      setFormValues({ ...formValues, image: reader.result });
    };

    reader.readAsDataURL(file);
  }, [formValues]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*' });

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Create Media Account</Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Platform</InputLabel>
        <Select
          value={formValues.platform}
          onChange={handlePlatformChange}
          label="Platform"
          renderValue={(selected) => {
            const platform = platforms.find((p) => p.name === selected);
            return (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <img src={platform?.logo} alt={platform?.name} style={{ width: 24, height: 24, marginRight: 8 }} />
                {selected}
              </Box>
            );
          }}
        >
          {platforms.map((platform) => (
            <MenuItem key={platform.name} value={platform.name}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <img src={platform.logo} alt={platform.name} style={{ width: 24, height: 24, marginRight: 8 }} />
                {platform.name}
              </Box>
            </MenuItem>
          ))}
          <MenuItem onClick={() => setIsAddingPlatform(true)}>
            <Typography>Add New Platform...</Typography>
          </MenuItem>
        </Select>
        {isAddingPlatform && (
          <Box sx={{ mt: 2 }}>
            <TextField
              label="New Platform Name"
              name="newPlatform"
              value={formValues.newPlatform}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleAddPlatform}>
              Add Platform
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => setIsAddingPlatform(false)} sx={{ ml: 2 }}>
              Cancel
            </Button>
          </Box>
        )}
      </FormControl>

      <TextField
        label="Site Name" // Add input for siteName
        name="siteName"
        value={formValues.siteName}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Site URL" // Add input for siteURL
        name="siteURL"
        value={formValues.siteURL}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Email"
        name="email"
        value={formValues.email}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Username"
        name="username"
        value={formValues.username}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        value={formValues.password}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Notes"
        name="notes"
        value={formValues.notes}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="2FA Phone"
        name="FA_phone"
        value={formValues.FA_phone}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="2FA App"
        name="FA_App"
        value={formValues.FA_App}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Recovery Email"
        name="Recovery_Email"
        value={formValues.Recovery_Email}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Backup Codes"
        name="Backup_Codes"
        value={formValues.Backup_Codes}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />

      <Box {...getRootProps()} sx={{ border: '2px dashed gray', p: 5, textAlign: 'center', mb: 2 }}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography>Drop the image here...</Typography>
        ) : (
          <Typography>Drag & drop an image here, or click to select one</Typography>
        )}
      </Box>

      {formValues.image && (
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <img src={formValues.image} alt="Selected" style={{ maxWidth: '10%' }} />
        </Box>
      )}

      <Button type="submit" variant="contained" color="primary">
        Save
      </Button>
    </Box>
  );
};

export default MediaAccountForm;
