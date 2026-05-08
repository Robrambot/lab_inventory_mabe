import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Autocomplete,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Divider,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Input,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { db } from '../firebase';
import { collection, getDocs, query, where, writeBatch, doc, Timestamp } from 'firebase/firestore';

const CLOUD_NAME = 'dq9bdcdpw';
const UPLOAD_PRESET = 'prestamos-app';

const NuevoPrestamo = () => {
  // Form states
  const [solicitante, setSolicitante] = useState('');
  const [responsable, setResponsable] = useState('');
  const [fechaPrestamo, setFechaPrestamo] = useState(new Date().toISOString().slice(0, 10));
  const [fechaDevolucion, setFechaDevolucion] = useState('');
  const [comentarios, setComentarios] = useState('');
  const [fotoFile, setFotoFile] = useState(null);
  
  // Instrument selection states
  const [instrumentosDisponibles, setInstrumentosDisponibles] = useState([]);
  const [instrumentoSeleccionado, setInstrumentoSeleccionado] = useState(null);
  const [itemsPrestamo, setItemsPrestamo] = useState([]);

  // Control states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const responsables = ['Francisco', 'Uriel', 'Guillermo'];

  const fetchInstrumentos = async () => {
    const q = query(collection(db, 'instrumentos'), where('estado', '==', 'disponible'));
    const querySnapshot = await getDocs(q);
    const inventario = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setInstrumentosDisponibles(inventario);
  };

  useEffect(() => {
    fetchInstrumentos();
  }, []);

  const handleFotoChange = (event) => {
    if (event.target.files[0]) {
        setFotoFile(event.target.files[0]);
    }
  };

  const resetForm = () => {
    setSolicitante('');
    setResponsable('');
    setFechaPrestamo(new Date().toISOString().slice(0, 10));
    setFechaDevolucion('');
    setComentarios('');
    setItemsPrestamo([]);
    setFotoFile(null);
    fetchInstrumentos();
  }

  const uploadToCloudinary = async () => {
    if (!fotoFile) return null;

    const formData = new FormData();
    formData.append('file', fotoFile);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al subir la imagen a Cloudinary.');
      }

      const data = await response.json();
      return data.secure_url;

    } catch (e) {
      console.error(e);
      setError(e.message);
      return null;
    }
  }

  const handleSavePrestamo = async () => {
    if (!isFormValid()) return;
    setIsSubmitting(true);
    setError('');
    
    try {
      // 1. Subir la imagen a Cloudinary
      const fotoUrl = await uploadToCloudinary();
      if (!fotoUrl) {
          // Si la subida falla, el error ya se ha establecido en uploadToCloudinary
          setIsSubmitting(false);
          return;
      }

      // 2. Preparar los datos para Firestore
      const prestamoData = {
        solicitante,
        responsable,
        fechaPrestamo: Timestamp.fromDate(new Date(fechaPrestamo)),
        fechaDevolucion: Timestamp.fromDate(new Date(fechaDevolucion)),
        comentarios,
        estado: 'Activo',
        items: itemsPrestamo.map(item => ({ id: item.id, nombre: item.nombre, identificador: item.identificador })),
        fechaCreacion: Timestamp.now(),
        fotoUrl: fotoUrl
      };

      // 3. Guardar en Firestore en un batch
      const batch = writeBatch(db);
      const prestamoRef = doc(collection(db, "prestamos"));
      batch.set(prestamoRef, prestamoData);
      
      itemsPrestamo.forEach(item => {
        const instrumentRef = doc(db, "instrumentos", item.id);
        batch.update(instrumentRef, { 
          estado: "prestado",
          prestamoActualId: prestamoRef.id
        });
      });

      await batch.commit();

      alert('¡Préstamo guardado con éxito!');
      resetForm();

    } catch (e) {
      console.error("Error al guardar el préstamo: ", e);
      setError(`Error al guardar en Firestore: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddItem = () => {
    if (instrumentoSeleccionado) {
      setItemsPrestamo([...itemsPrestamo, instrumentoSeleccionado]);
      setInstrumentosDisponibles(instrumentosDisponibles.filter(i => i.id !== instrumentoSeleccionado.id));
      setInstrumentoSeleccionado(null);
    }
  };
  
  const handleRemoveItem = (itemToRemove) => {
    setItemsPrestamo(itemsPrestamo.filter(item => item.id !== itemToRemove.id));
    setInstrumentosDisponibles([...instrumentosDisponibles, itemToRemove]);
  };

  const isFormValid = () => solicitante && responsable && fechaPrestamo && fechaDevolucion && itemsPrestamo.length > 0 && fotoFile;

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: '12px' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
          Registrar Nuevo Préstamo
        </Typography>
        <Box component="form" noValidate autoComplete="off">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}><TextField required fullWidth label="Nombre del Solicitante" value={solicitante} onChange={(e) => setSolicitante(e.target.value)} /></Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Responsable del Préstamo</InputLabel>
                <Select value={responsable} label="Responsable del Préstamo" onChange={(e) => setResponsable(e.target.value)}>
                  {responsables.map(name => <MenuItem key={name} value={name}>{name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}><TextField required fullWidth label="Fecha de Préstamo" type="date" value={fechaPrestamo} onChange={(e) => setFechaPrestamo(e.target.value)} InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={12} sm={6}><TextField required fullWidth label="Fecha de Devolución" type="date" value={fechaDevolucion} onChange={(e) => setFechaDevolucion(e.target.value)} InputLabelProps={{ shrink: true }} /></Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" gutterBottom>Instrumentos a Prestar</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Autocomplete fullWidth options={instrumentosDisponibles} getOptionLabel={(option) => `${option.nombre} - ${option.identificador}`} value={instrumentoSeleccionado} onChange={(event, newValue) => setInstrumentoSeleccionado(newValue)} renderInput={(params) => <TextField {...params} label="Buscar instrumento" />} />
            <Button variant="contained" onClick={handleAddItem} disabled={!instrumentoSeleccionado} sx={{ py: 1.5 }}><AddCircleOutlineIcon /></Button>
          </Box>
          <List>
            {itemsPrestamo.map((item) => <ListItem key={item.id} secondaryAction={<IconButton onClick={() => handleRemoveItem(item)}><DeleteIcon /></IconButton>} sx={{ bgcolor: '#f5f5f5', borderRadius: 1, mb: 1 }}><ListItemText primary={item.nombre} secondary={item.identificador} /></ListItem>)}
          </List>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Button variant="outlined" component="label" fullWidth startIcon={<PhotoCamera />}>
                Añadir Foto (Requerido)
                <Input type="file" hidden accept="image/*" onChange={handleFotoChange} />
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
                {fotoFile && <Typography variant="body2">{fotoFile.name}</Typography>}
            </Grid>
          </Grid>

          <TextField fullWidth label="Comentarios (Opcional)" multiline rows={3} value={comentarios} onChange={(e) => setComentarios(e.target.value)} sx={{ my: 3 }} />
          
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Button variant="contained" size="large" sx={{ fontWeight: 'bold' }} disabled={!isFormValid() || isSubmitting} onClick={handleSavePrestamo}>
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Guardar Préstamo'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default NuevoPrestamo;
