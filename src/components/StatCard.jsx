import { Paper, Typography, Box } from '@mui/material';

const StatCard = ({ title, value }) => {
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        textAlign: 'center', 
        borderRadius: '12px',
        // Usamos los colores del tema para el fondo y el texto
        backgroundColor: 'primary.main',
        color: 'primary.contrastText' 
      }}
    >
      <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
        {title}
      </Typography>
      <Typography variant="h3" component="div">
        {value}
      </Typography>
    </Paper>
  );
};

export default StatCard;
