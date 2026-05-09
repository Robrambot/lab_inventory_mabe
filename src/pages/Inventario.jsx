
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getInstrumentos } from "../services/firestoreService";
import InstrumentCard from "../components/InstrumentCard";
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button, 
  CircularProgress,
  Fab
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const Inventario = () => {
  const navigate = useNavigate();
  const [instrumentos, setInstrumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchInstrumentos = async () => {
      setLoading(true);
      try {
        setError(null);
        const data = await getInstrumentos();
        setInstrumentos(data);
      } catch (err) {
        console.error("Error al cargar el inventario:", err);
        setError("No se pudo cargar el inventario. Por favor, revisa las reglas de Firestore.");
      } finally {
        setLoading(false);
      }
    };
    fetchInstrumentos();
  }, []);

  const filteredInstrumentos = useMemo(() => {
    return instrumentos.filter((instrumento) => {
      const searchMatch = searchTerm.toLowerCase() === '' ? true : 
        instrumento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
        instrumento.identificador.toLowerCase().includes(searchTerm.toLowerCase());
      
      const statusMatch = statusFilter === '' ? true : instrumento.estado.toLowerCase() === statusFilter.toLowerCase();

      return searchMatch && statusMatch;
    });
  }, [instrumentos, searchTerm, statusFilter]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
  };

  const handleAddInstrument = () => {
    navigate('/inventario/nuevo');
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mt: 4, mb: 4 }}>
        Inventario General
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: '12px' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Buscar por Nombre o ID"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{ endAdornment: <SearchIcon color="action" /> }}
            />
          </Grid>
          <Grid item xs={9} md={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Filtrar por Estado</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Filtrar por Estado"
              >
                <MenuItem value=""><em>Todos</em></MenuItem>
                <MenuItem value="disponible">Disponible</MenuItem>
                <MenuItem value="prestado">Prestado</MenuItem>
                <MenuItem value="mantenimiento">En Mantenimiento</MenuItem>
                <MenuItem value="vencido">Vencido</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3} md={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleClearFilters}
              sx={{ height: '100%' }}
            >
              <ClearIcon />
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
      ) : error ? (
        <Typography color="error" sx={{ textAlign: 'center' }}>{error}</Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredInstrumentos.length > 0 ? (
            filteredInstrumentos.map((instrumento) => (
              <Grid item key={instrumento.id} xs={12} md={6} lg={4}>
                <InstrumentCard instrumento={instrumento} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography sx={{ textAlign: 'center', mt: 4 }}>No se encontraron instrumentos que coincidan con los filtros.</Typography>
            </Grid>
          )}
        </Grid>
      )}
       <Fab 
        color="primary" 
        aria-label="add" 
        sx={{ 
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={handleAddInstrument}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default Inventario;
