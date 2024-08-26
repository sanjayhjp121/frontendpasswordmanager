import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import {
    Box,
    Stack,
    Button,
    TextField,
} from '@mui/material';

function VaultForm({ onClose }) {
    const [formData, setFormData] = useState({
        user_id: '',
        type: '',
        username: '',
        password: '',
        expiration_date: '',
        agency: '',
        siteName: '',
        siteURL: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting form with data:", formData); // Add this line to debug form data
        try {
            const token = localStorage.getItem('token'); // Get the token from localStorage
            const response = await axios.post(
                `${process.env.API_URL}/user/createPassword`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}` // Pass the token in the Authorization header
                    }
                }
            );
            alert(response.data.message);
            onClose();
        } catch (error) {
            console.error("Error in form submission:", error); // Add this line to debug errors
            alert('Error saving vault details');
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                width: '500px', // Set the desired width here
                p: 2,
                backgroundColor: 'background.paper',
                borderRadius: 1,
                boxShadow: 3,
            }}
        >
            <Stack spacing={2}>
                <TextField
                    label="User ID"
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                <TextField
                    label="Type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                <TextField
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                <TextField
                    label="Expiration Date"
                    name="expiration_date"
                    type="date"
                    value={formData.expiration_date}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{
                        shrink: true
                    }}
                    required
                />
                <TextField
                    label="Agency"
                    name="agency"
                    value={formData.agency}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                <TextField
                    label="Site Name"
                    name="siteName"
                    value={formData.siteName}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                <TextField
                    label="Site URL"
                    name="siteURL"
                    value={formData.siteURL}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                <Button type="submit" variant="contained" color="primary">
                    Save
                </Button>
            </Stack>
        </Box>
    );
}

// Define prop types for the component
VaultForm.propTypes = {
    onClose: PropTypes.func.isRequired // Define the expected type for onClose
};

export default VaultForm;
