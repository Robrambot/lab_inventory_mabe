import React, { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  CircularProgress,
  Chip,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ListaPrestamos = () => {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrestamos = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "prestamos"), orderBy("fechaCreacion", "desc"));
        const querySnapshot = await getDocs(q);
        const prestamosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPrestamos(prestamosData);
      } catch (error) {
        console.error("Error al cargar los préstamos: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrestamos();
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mt: 4, mb: 4 }}>
        Historial de Préstamos
      </Typography>
      <Paper elevation={2}>
        <List>
          {prestamos.map((prestamo, index) => (
            <React.Fragment key={prestamo.id}>
              <ListItem>
                <ListItemText 
                  primary={`Solicitante: ${prestamo.solicitante}`}
                  secondary={`Fecha: ${new Date(prestamo.fechaPrestamo.seconds * 1000).toLocaleDateString()} - Responsable: ${prestamo.responsable}`}
                />
                <Chip 
                  label={prestamo.estado}
                  color={prestamo.estado === 'Activo' ? 'success' : 'default'}
                  size="small"
                  sx={{ mr: 2, fontWeight: 'bold' }}
                />
                <Button 
                  variant="outlined"
                  size="small"
                  onClick={() => navigate(`/prestamo/${prestamo.id}`)}
                >
                  Ver Detalles
                </Button>
              </ListItem>
              {index < prestamos.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
        {prestamos.length === 0 && (
            <Typography sx={{ textAlign: 'center', p: 4 }}>No hay préstamos registrados.</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default ListaPrestamos;
