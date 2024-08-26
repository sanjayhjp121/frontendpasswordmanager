import axios from 'axios';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { alpha, useTheme } from '@mui/material/styles';
import { Box, Link, Card,Stack,Button, TextField, Typography } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';

export default function ForgotPasswordView() {
  const theme = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${process.env.API_URL}/user/forgetPassword`, { email });

      if (response.data.code === 200) {
        setMessage('Password reset instructions have been sent to your email.');
      } else {
        setError('Failed to send password reset instructions.');
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
          <Typography variant="h4">Forgot Password</Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Enter your email to receive a link to reset your password.
          </Typography>

          <Stack spacing={3}>
            <TextField
              name="email"
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            Send Reset Link
          </Button>

          <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ mt: 2 }}>
            <Link
              variant="subtitle2"
              component={RouterLink}
              underline="hover"
              onClick={() => router.push('/login')}
            >
              Back to login
            </Link>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}
