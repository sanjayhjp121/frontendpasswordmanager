import axios from 'axios';
import React, { useState, useEffect } from 'react';

import { Delete as DeleteIcon } from '@mui/icons-material';
import {
  Card,
  Stack,
  Button,
  Dialog,
  Container,
  ImageList,
  IconButton,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  ImageListItem,
  ImageListItemBar,
} from '@mui/material';

import Iconify from 'src/components/iconify';

export default function MediaManager() {
  const [images, setImages] = useState([]);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [error, setError] = useState(null);

  const fetchImages = async () => {
    try {
      const response = await axios.get(`${process.env.API_URL}/admin/getImages`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setImages(response.data.data);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Error fetching images.');
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUploadImage = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(`${process.env.API_URL}/admin/uploadImage`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setImages([...images, response.data.data]);
      setOpenImageDialog(false);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Error uploading image.');
    }
  };

  const handleDeleteImage = async (id) => {
    try {
      await axios.delete(`${process.env.API_URL}/admin/deleteImage/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setImages(images.filter(image => image.id !== id));
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Error deleting image.');
    }
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Media Manager</Typography>
        <Button variant="contained" color="primary" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => setOpenImageDialog(true)}>
          Upload Image
        </Button>
      </Stack>

      <Card>
        {images.length === 0 && <Typography variant="body1" align="center">No images uploaded.</Typography>}
        <ImageList cols={3}>
          {images.map((image) => (
            <ImageListItem key={image.id}>
              <img src={image.url} alt={image.name} loading="lazy" />
              <ImageListItemBar
                title={image.name}
                actionIcon={
                  <IconButton onClick={() => handleDeleteImage(image.id)} color="primary">
                    <DeleteIcon />
                  </IconButton>
                }
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Card>

      <Dialog open={openImageDialog} onClose={() => setOpenImageDialog(false)}>
        <DialogTitle>Upload Image</DialogTitle>
        <DialogContent>
          <input type="file" onChange={handleUploadImage} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenImageDialog(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {error && <Typography color="error">{error}</Typography>}
    </Container>
  );
}
