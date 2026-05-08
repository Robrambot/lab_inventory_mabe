import React from 'react';
import { Box, Paper } from '@mui/material';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { Home, ListAlt, AddCircle, Assignment } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        {children}
      </Box>
      <Paper sx={{ position: 'sticky', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={location.pathname}
        >
          <BottomNavigationAction label="Dashboard" icon={<Home />} component={Link} to="/" value="/" />
          <BottomNavigationAction label="Inventario" icon={<ListAlt />} component={Link} to="/inventario" value="/inventario" />
          <BottomNavigationAction label="Préstamos" icon={<Assignment />} component={Link} to="/prestamos" value="/prestamos" />
          <BottomNavigationAction label="Nuevo Préstamo" icon={<AddCircle />} component={Link} to="/nuevo-prestamo" value="/nuevo-prestamo" />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default Layout;
