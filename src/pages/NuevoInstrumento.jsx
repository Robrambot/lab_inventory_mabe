import { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Paper, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { uploadToCloudinary } from '../services/cloudinaryService';
import { addInstrumento } from '../services/firestoreService';

const NuevoInstrumento = () => {
  const navigate = useNavigate();
  // Form state
  const [nombre, setNombre] = useState('');
  const [identificador, setIdentificador] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [foto, setFoto] = useState(null);
  // Control state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validaciones
    if (!nombre || !identificador || !foto) {
      setError('El nombre, el identificador y la foto son campos obligatorios.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // 1. Subir la imagen a Cloudinary
      const fotoURL = await uploadToCloudinary(foto);
      if (!fotoURL) {
        throw new Error('La subida de la imagen falló y no se recibió una URL.');
      }

      // 2. Preparar los datos para Firestore
      const instrumentoData = {
        nombre,
        identificador,
        marca,
        modelo,
        observaciones,
        fotoURL, // Añadimos la URL de la imagen
      };

      // 3. Guardar en Firestore
      await addInstrumento(instrumentoData);

      setSuccess('¡Instrumento guardado con éxito! Redirigiendo...');

      // 4. Redirigir al inventario después de un breve retraso
      setTimeout(() => {
        navigate('/inventario');
      }, 2000);

    } catch (err) {
      console.error(err);
      setError(err.message || 'Ocurrió un error inesperado al guardar el instrumento.');
    } finally {
      setLoading(false);
    }
  };

  const isFormInvalid = !nombre || !identificador || !foto || loading;

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 5, borderRadius: '12px' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Añadir Nuevo Instrumento
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField label="Nombre del Instrumento" fullWidth required value={nombre} onChange={(e) => setNombre(e.target.value)} sx={{ mb: 2 }} />
          <TextField label="Identificador Único" fullWidth required value={identificador} onChange={(e) => setIdentificador(e.target.value)} sx={{ mb: 2 }} />
          <TextField label="Marca" fullWidth value={marca} onChange={(e) => setMarca(e.target.value)} sx={{ mb: 2 }} />
          <TextField label="Modelo" fullWidth value={modelo} onChange={(e) => setModelo(e.target.value)} sx={{ mb: 2 }} />
          <TextField label="Observaciones" fullWidth multiline rows={3} value={observaciones} onChange={(e) => setObservaciones(e.target.value)} sx={{ mb: 2 }} />
          
          <Button variant="contained" component="label" fullWidth sx={{ mb: 2 }}>
            Subir Foto
            <input type="file" hidden accept="image/*" onChange={(e) => setFoto(e.target.files[0])} />
          </Button>

          {foto && <Typography variant="body2" sx={{ mb: 2, textAlign: 'center' }}>Archivo: {foto.name}</Typography>}

          {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ my: 2 }}>{success}</Alert>}

          <Button type="submit" variant="contained" color="primary" fullWidth disabled={isFormInvalid} sx={{ mt: 2, py: 1.5, fontWeight: 'bold' }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Guardar Instrumento'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NuevoInstrumento;
