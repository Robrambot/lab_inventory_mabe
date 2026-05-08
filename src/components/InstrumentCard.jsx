import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
} from '@mui/material';

const estadoColors = {
  disponible: 'success',
  prestado: 'warning',
  vencido: 'error',
  mantenimiento: 'default',
};

const InstrumentCard = ({ instrumento }) => {
  const navigate = useNavigate();
  const { nombre, identificador, imagen, estado, prestamoActualId } = instrumento;

  const isClickable = estado === 'prestado' && prestamoActualId;

  const handleClick = () => {
    if (isClickable) {
      navigate(`/prestamo/${prestamoActualId}`);
    }
  };

  return (
    <Card sx={{ display: 'flex', mb: 2, boxShadow: 3 }}>
      <CardActionArea onClick={handleClick} disabled={!isClickable} sx={{ display: 'flex', textDecoration: 'none', color: 'inherit'}}>
        <CardMedia
          component="img"
          sx={{ width: 151 }}
          image={imagen || 'https://via.placeholder.com/151'}
          alt={nombre}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography component="div" variant="h5">
              {nombre}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" component="div">
              ID: {identificador}
            </Typography>
          </CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', pl: 2, pb: 1 }}>
            <Chip
              label={estado.charAt(0).toUpperCase() + estado.slice(1)}
              color={estadoColors[estado.toLowerCase()] || 'default'}
              size="small"
            />
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default InstrumentCard;
