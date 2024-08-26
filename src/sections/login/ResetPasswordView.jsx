import axios from 'axios';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { alpha, useTheme } from '@mui/material/styles';
import { Box, Card, Stack, Button, TextField, Typography } from '@mui/material';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';

export default function ResetPasswordView() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const query = new URLSearchParams(location.search);
  const userId = query.get('user_id');

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${process.env.API_URL}/user/resetPassword`, {
        user_id: userId,
        password,
      });

      if (response.data.code === 200) {
        setMessage('Your password has been reset successfully.');
        setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
      } else {
        setError('Failed to reset password.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
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
          <Typography variant="h4">Reset Password</Typography>

          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              name="password"
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Stack>

          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          {message && (
            <Typography variant="body2" color="success" sx={{ mt: 2 }}>
              {message}
            </Typography>
          )}

          <Button
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            color="inherit"
            onClick={handleSubmit}
            loading={loading}
            sx={{ mt: 2 }}
          >
            Reset Password
          </Button>
        </Card>
      </Stack>
    </Box>
  );
}
