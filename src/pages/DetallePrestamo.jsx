import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, writeBatch } from 'firebase/firestore';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Grid
} from '@mui/material';

const DetallePrestamo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prestamo, setPrestamo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchPrestamo = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "prestamos", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPrestamo({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("No se encontró el préstamo.");
        }
      } catch (e) {
        setError("Error al cargar el préstamo.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchPrestamo();
  }, [id]);

  const handleMarcarComoDevuelto = async () => {
    if (!prestamo || prestamo.estado !== 'Activo') return;

    setIsUpdating(true);
    try {
      const batch = writeBatch(db);

      const prestamoRef = doc(db, "prestamos", id);
      batch.update(prestamoRef, { estado: "Devuelto" });

      prestamo.items.forEach(item => {
        const instrumentoRef = doc(db, "instrumentos", item.id);
        batch.update(instrumentoRef, { 
            estado: "disponible",
            prestamoActualId: null
        });
      });

      await batch.commit();

      setPrestamo(prev => ({ ...prev, estado: 'Devuelto' }));
      alert("El préstamo ha sido marcado como devuelto.");
      navigate('/prestamos');

    } catch (e) {
      setError("Error al actualizar el estado. Por favor, inténtalo de nuevo.");
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error" sx={{ m: 4 }}>{error}</Alert>;
  }

  return (
    <Container maxWidth="md">
      {prestamo && (
        <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: '12px' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Detalle del Préstamo
          </Typography>
          <Chip 
              label={prestamo.estado}
              color={prestamo.estado === 'Activo' ? 'success' : 'error'}
              sx={{ fontWeight: 'bold', mb: 2 }}
          />
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}><Typography><strong>Solicitante:</strong> {prestamo.solicitante}</Typography></Grid>
            <Grid item xs={12} sm={6}><Typography><strong>Responsable:</strong> {prestamo.responsable}</Typography></Grid>
            <Grid item xs={12} sm={6}><Typography><strong>Fecha Préstamo:</strong> {new Date(prestamo.fechaPrestamo.seconds * 1000).toLocaleDateString()}</Typography></Grid>
            <Grid item xs={12} sm={6}><Typography><strong>Fecha Devolución:</strong> {new Date(prestamo.fechaDevolucion.seconds * 1000).toLocaleDateString()}</Typography></Grid>
          </Grid>
          {prestamo.comentarios && <Typography sx={{ mb: 2 }}><strong>Comentarios:</strong> {prestamo.comentarios}</Typography>}
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>Instrumentos Prestados</Typography>
          <List>
            {prestamo.items.map(item => (
              <ListItem key={item.id}><ListItemText primary={item.nombre} secondary={item.identificador} /></ListItem>
            ))}
          </List>
          {prestamo.fotoUrl && (
            <Box sx={{ my: 3 }}>
              <Typography variant="h6" gutterBottom>Foto de Salida</Typography>
              <img src={prestamo.fotoUrl} alt="Foto del préstamo" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
            </Box>
          )}
          {prestamo.estado === 'Activo' && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleMarcarComoDevuelto}
                disabled={isUpdating}
              >
                {isUpdating ? <CircularProgress size={24} /> : 'Marcar como Devuelto'}
              </Button>
            </Box>
          )}
        </Paper>
      )}
    </Container>
  );
};

export default DetallePrestamo;
