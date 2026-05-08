
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Box,
  Divider,
  Chip
} from '@mui/material';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const PrestamosActivos = () => {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'prestamos'), 
      where('estado', '==', 'Activo'),
      orderBy('fechaCreacion', 'desc')
    );

    // Usamos onSnapshot para escuchar cambios en tiempo real
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const prestamosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPrestamos(prestamosData);
      setLoading(false);
    }, (error) => {
      console.error("Error al obtener préstamos activos: ", error);
      setLoading(false);
    });

    // Limpiar el listener al desmontar el componente
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, mb: 4, fontWeight: 'bold' }}>
        Préstamos Activos
      </Typography>
      <Paper elevation={3} sx={{ borderRadius: '12px' }}>
        <List >
          {prestamos.length === 0 ? (
            <ListItem>
              <ListItemText primary="No hay préstamos activos en este momento." />
            </ListItem>
          ) : (
            prestamos.map((prestamo, index) => (
              <React.Fragment key={prestamo.id}>
                <ListItem
                  button 
                  // onClick={() => console.log('Ir a detalle de prestamo', prestamo.id)}
                  sx={{ py: 2 }}
                >
                  <ListItemText
                    primary={`Solicitante: ${prestamo.solicitante}`}
                    secondary={`Responsable: ${prestamo.responsable} | Items: ${prestamo.items.length}`}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Typography variant="body2" color="text.secondary">
                      Fecha de Préstamo: {prestamo.fechaPrestamo.toDate().toLocaleDateString()}
                    </Typography>
                    <Chip label={prestamo.estado} color="primary" size="small" sx={{ mt: 1 }}/>
                  </Box>
                </ListItem>
                {index < prestamos.length - 1 && <Divider />}
              </React.Fragment>
            ))
          )}
        </List>
      </Paper>
    </Container>
  );
};

export default PrestamosActivos;
