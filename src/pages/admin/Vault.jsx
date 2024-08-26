import axios from 'axios';
import { useState, useEffect } from 'react';

import {
    Box,
    Stack,
    Paper,
    Table,
    Button,
    Dialog,
    TableRow,
    Container,
    TableBody,
    TableCell,
    TableHead,
    Typography,
    DialogTitle,
    DialogActions,
    DialogContent,
    TableContainer,
} from '@mui/material';

import VaultForm from './VaultForm';

export default function VaultTable() {
    const [vaults, setVaults] = useState([]);
    const [open, setOpen] = useState(false);

    const fetchVaults = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }
    
            const response = await axios.get(`${process.env.API_URL}/user/getVault`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            setVaults(response.data);
        } catch (error) {
            console.error('Error fetching vault data:', error);
        }
    };
    

    useEffect(() => {
        fetchVaults();
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        fetchVaults();
    };

    return (
        <Container maxWidth="lg">
            <Stack direction="row" alignItems="center" justifyContent="space-between" my={2}>
                <Typography variant="h4">Vault Data</Typography>
                <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    Add Data
                </Button>
            </Stack>

            {vaults.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>User ID</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Username</TableCell>
                                <TableCell>Password</TableCell>
                                <TableCell>Expiration Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {vaults.map((vault) => (
                                <TableRow key={vault._id}>
                                    <TableCell>{vault.user_id}</TableCell>
                                    <TableCell>{vault.type}</TableCell>
                                    <TableCell>{vault.username}</TableCell>
                                    <TableCell>{vault.password}</TableCell>
                                    <TableCell>{new Date(vault.expiration_date).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Box mt={2}>
                    <Typography variant="h6" align="center">
                        No vault data available
                    </Typography>
                </Box>
            )}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Vault Data</DialogTitle>
                <DialogContent>
                    <VaultForm onClose={handleClose} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Cancel</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
