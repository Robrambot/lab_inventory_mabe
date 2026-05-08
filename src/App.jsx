import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Inventario from './pages/Inventario';
import NuevoPrestamo from './pages/NuevoPrestamo';
import ListaPrestamos from './pages/ListaPrestamos';
import DetallePrestamo from './pages/DetallePrestamo';

const theme = createTheme({
  palette: {
    primary: {
      main: '#002D72',
    },
    secondary: {
      main: '#FDB913',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/nuevo-prestamo" element={<NuevoPrestamo />} />
          <Route path="/prestamos" element={<ListaPrestamos />} />
          <Route path="/prestamo/:id" element={<DetallePrestamo />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
