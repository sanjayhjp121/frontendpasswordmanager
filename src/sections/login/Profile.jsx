import axios from 'axios';
import { useState, useEffect } from 'react';

import { LoadingButton } from '@mui/lab';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  Card,
  Grid,
  Stack,
  Button,
  Avatar,
  Divider,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    password: '',
    profileImage: '',
    uniqueId: '',
    phoneNumber: '',
    dob: '',
    description: '',
    companyName: '',
    companyAddress: '',
    emailVerified: false,
    phoneNumberVerified: false,
    isSubscribed: false,
    status: '',
    plan: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get(`${process.env.API_URL}/user/getProfile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = response.data.data;
        setUser(userData);
        setFormData({
          email: userData.email,
          fullName: userData.full_name,
          password: '',
          profileImage: userData.profile_image,
          uniqueId: userData.unique_id,
          phoneNumber: userData.phone_number,
          dob: userData.dob,
          description: userData.description,
          companyName: userData.company_name,
          companyAddress: userData.company_address,
          emailVerified: userData.email_verified,
          phoneNumberVerified: userData.phone_number_verified,
          isSubscribed: userData.is_subscribed,
          status: userData.status,
          plan: userData.plan,
        });
        setImage(userData.profile_image);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = async (file) => {
    const token = localStorage.getItem('token');
    const imageFormData = new FormData(); // Renamed to avoid shadowing
    imageFormData.append('profileImage', file);

    try {
      const response = await axios.post('http://localhost:5002/user/uploadProfileImage', imageFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setImage(response.data.profileImage);
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageChange(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5002/user/updateProfile', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditMode(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 3,
            p: 2,
            border: '2px dashed grey',
            borderRadius: '50%',
            cursor: 'pointer',
            width: 150,
            height: 150,
            mx: 'auto',
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <Avatar
            src={image}
            alt="Profile Image"
            sx={{ width: 150, height: 150 }}
          />
        </Box>
        <Stack spacing={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!editMode}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                disabled={!editMode}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Unique ID"
                name="uniqueId"
                value={formData.uniqueId}
                onChange={handleInputChange}
                disabled
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                disabled={!editMode}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date of Birth"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                disabled={!editMode}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                disabled={!editMode}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                disabled={!editMode}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Company Address"
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleInputChange}
                disabled={!editMode}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                disabled
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Plan"
                name="plan"
                value={formData.plan}
                onChange={handleInputChange}
                disabled
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                disabled={!editMode}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(prev => !prev)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          {editMode ? (
            <Stack direction="row" spacing={2}>
              <LoadingButton
                variant="contained"
                color="primary"
                onClick={handleUpdateProfile}
                loading={loading}
              >
                Save
              </LoadingButton>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </Button>
            </Stack>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </Button>
          )}
        </Stack>
      </Card>
    </Box>
  );
}
