import axios from 'axios';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import {
    Box,
    Card,
    Stack,
    Divider,
    TextField,
    Typography,
    Link as MuiLink,
} from '@mui/material';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';

export default function ForgotPassword() {
    const theme = useTheme();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const userType = localStorage.getItem('userType');

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${process.env.API_URL}/${userType}/forgot-password`, { email });
            setSuccess(response.data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send password reset email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                ...bgGradient({
                    color: alpha(theme.palette.background.default, 0.9),
                    imgUrl: '/assets/background/overlay_4.jpg',
                }),
                height: 1,
            }}
        >
            <Logo
                sx={{
                    position: 'fixed',
                    top: { xs: 16, md: 24 },
                    left: { xs: 16, md: 24 },
                }}
            />

            <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
                <Card
                    sx={{
                        p: 5,
                        width: 1,
                        maxWidth: 420,
                    }}
                >
                    <Typography variant="h4">Forgot Password</Typography>
                    <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
                        Enter your email address below and we will send you a link to reset your password.
                    </Typography>

                    <Stack spacing={3}>
                        <TextField
                            name="email"
                            label="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                        />

                        {error && (
                            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                                {error}
                            </Typography>
                        )}
                        {success && (
                            <Typography variant="body2" color="success" sx={{ mt: 2 }}>
                                {success}
                            </Typography>
                        )}

                        <LoadingButton
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                            color="inherit"
                            onClick={handleSubmit}
                            loading={loading}
                        >
                            Send Reset Link
                        </LoadingButton>
                    </Stack>

                    <Divider sx={{ my: 3 }} />

                    <MuiLink component={RouterLink} to="/" variant="subtitle2" sx={{ ml: 0.5 }}>
                        Back to login
                    </MuiLink>
                </Card>
            </Stack>
        </Box>
    );
}
