import React, { useState } from "react";
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Button, TextField, Stack, CssBaseline
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#22d3ee" },       // cian
    secondary: { main: "#a78bfa" },     // violeta
    error: { main: "#ef4444" },
    background: { default: "#0b1220", paper: "#111827" }, // dark limpio
    text: { primary: "#e5e7eb", secondary: "#94a3b8" }
  }
});



const inputSX = {
  bgcolor: "#f3f4f6",       // fondo claro para inputs
  borderRadius: 1,
  input: { color: "#111827" },
  "& .MuiInputLabel-root": { color: "#374151" },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#cbd5e1" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#94a3b8" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#22d3ee" }
};

const ListaAprendices = () => {
  const API_BASE = "http://localhost:8080/api/v1/aprendiz";
  //const API_BASE = "https://backadso-production.up.railway.app/api/v1/aprendiz"

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(formInitialState);
  const [idFiltro, setIdFiltro] = useState("");

  const fetchTodos = async () => {  
    try {
      setLoading(true);
      const res = await axios.get(API_BASE);
      setData(res.data || []);
    } catch (e) {
      console.error("Error cargando aprendices:", e);
      setData([]);
    } finally { setLoading(false); }
  };

  const fetchPorId = async () => {
  if (!idFiltro) return;
  try {
    setLoading(true);
    const res = await axios.get(`${API_BASE}/${idFiltro}`);
    setData(res.data ? [res.data] : []);

    // Rellenar el formulario con los datos traídos
    if (res.data) {
      setForm({
        nombre: res.data.nombre ?? "",
        apellido: res.data.apellido ?? "",
        email: res.data.email ?? "",
        telefono: res.data.telefono ?? "",
        direccion: res.data.direccion ?? "",
        cedula: res.data.cedula ?? "",
        tipoDePrograma: res.data.tipoDePrograma ?? "",
        programa: res.data.programa ?? "",
        ficha: res.data.ficha ?? "",
        regional: res.data.regional ?? ""
      });
    }
  } catch {
    setData([]);
  } finally {
    setLoading(false);
  }
};

  const crearAprendiz = async () => {
    try {
      setLoading(true);
      await axios.post(API_BASE, form, { headers: { "Content-Type": "application/json" } });
      setForm(formInitialState);  
      await fetchTodos();
    } catch (e) { console.error("Error creando aprendiz:", e); }
    finally { setLoading(false); }
  };

  const eliminarPorId = async () => {
    if (!idFiltro) return;
    try { setLoading(true); await axios.delete(`${API_BASE}/${idFiltro}`); await fetchTodos(); }
    catch (e) { console.error("Error eliminando aprendiz:", e); }
    finally { setLoading(false); }
  };
  const actualizarPorId = async () => {
  if (!idFiltro) return;
  console.log("PUT a", `${API_BASE}/${idFiltro}`, "con:", form);
  try {
    setLoading(true);
    await axios.put(`${API_BASE}/${idFiltro}`, form, { headers: { "Content-Type": "application/json" } });
    setForm(formInitialState);
    await fetchTodos();
  } catch (e) {
    console.error("Error actualizando aprendiz:", e.response?.data || e.message);
  } finally {
    setLoading(false);
  }
};   

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ mt: 4, px: { xs: 2, md: 4 } }}>
        {/* Barra de acciones */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5" sx={{ flex: 1, fontWeight: 700, color: "text.primary" }}>
            Aprendices
          </Typography>
          <Button variant="contained" color="primary" onClick={fetchTodos} disabled={loading}>
            {loading ? "Cargando..." : "VER TODOS"}
          </Button>
          <TextField
            size="small" label="ID" value={idFiltro} onChange={(e) => setIdFiltro(e.target.value)}
            sx={{ ...inputSX, width: 140 }}
          />
          <Button variant="contained" color="secondary" onClick={fetchPorId} disabled={loading || !idFiltro}>
            BUSCAR POR ID
          </Button>
          <Button variant="contained" color="error" onClick={eliminarPorId} disabled={loading || !idFiltro}>
            ELIMINAR POR ID
          </Button>
          <Button variant="contained" color="primary" onClick={actualizarPorId} disabled={loading || !idFiltro}>
            ACTUALIZAR POR ID
          </Button>
        </Stack>

        {/* Formulario creación */}
        <Paper elevation={4} sx={{ p: 2, mb: 3, border: "1px solid #334155", bgcolor: "background.paper" }}>
          <Typography sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}>Crear aprendiz</Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField label="Nombre" value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })} sx={{ ...inputSX, flex: 1 }} />
            <TextField label="Apellido" value={form.apellido}
              onChange={(e) => setForm({ ...form, apellido: e.target.value })} sx={{ ...inputSX, flex: 1 }} />
            <TextField label="Email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} sx={{ ...inputSX, flex: 1.2 }} />
            <TextField label="Teléfono" value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })} sx={{ ...inputSX, flex: 1 }} />
            <TextField label="Dirección" value={form.direccion}
              onChange={(e) => setForm({ ...form, direccion: e.target.value })} sx={{ ...inputSX, flex: 1.6 }} />
            <TextField label="Cedula" value={form.cedula}
              onChange={(e) => setForm({ ...form, cedula: e.target.value })} sx={{ ...inputSX, flex: 1 }} />
            <TextField label="Tipo de Programa" value={form.tipoDePrograma}
              onChange={(e) => setForm({ ...form, tipoDePrograma: e.target.value })} sx={{ ...inputSX, flex: 1.2 }} />
            <TextField label="Programa" value={form.programa}
              onChange={(e) => setForm({ ...form, programa: e.target.value })} sx={{ ...inputSX, flex: 1.2 }} />
            <TextField label="Ficha" value={form.ficha}
              onChange={(e) => setForm({ ...form, ficha: e.target.value })} sx={{ ...inputSX, flex: 1 }} />
            <TextField label="Regional" value={form.regional}
              onChange={(e) => setForm({ ...form, regional: e.target.value })} sx={{ ...inputSX, flex: 1.2 }} />
            <Button variant="contained" color="primary" onClick={crearAprendiz} disabled={loading}>
              CREAR
            </Button>
          </Stack>
        </Paper>

        {/* Tabla */}
        <TableContainer component={Paper} elevation={3} sx={{ border: "1px solid #334155", bgcolor: "background.paper" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ background: "#22d3ee" }}>
                {["ID","Nombre","Apellido","Email","Teléfono","Dirección","Cedula","Tipo de Programa","Programa","Ficha","Regional"].map((h) => (
                  <TableCell key={h} sx={{ color: "#0b1220", fontWeight: 700 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, i) => (
                <TableRow
                  key={row.id ?? i}
                  sx={{
                    backgroundColor: i % 2 === 0 ? "#0f172a" : "#111827",
                    "&:hover": { backgroundColor: "#1f2937" }
                  }}
                >
                  <TableCell sx={{ color: "text.primary" }}>{row.id}</TableCell>
                  <TableCell sx={{ color: "text.primary" }}>{row.nombre}</TableCell>
                  <TableCell sx={{ color: "text.primary" }}>{row.apellido}</TableCell>
                  <TableCell sx={{ color: "text.primary" }}>{row.email}</TableCell>
                  <TableCell sx={{ color: "text.primary" }}>{row.telefono}</TableCell>
                  <TableCell sx={{ color: "text.primary" }}>{row.direccion}</TableCell>
                  <TableCell sx={{ color: "text.primary" }}>{row.cedula}</TableCell>
                  <TableCell sx={{ color: "text.primary" }}>{row.tipoDePrograma}</TableCell>
                  <TableCell sx={{ color: "text.primary" }}>{row.programa}</TableCell>
                  <TableCell sx={{ color: "text.primary" }}>{row.ficha}</TableCell>
                  <TableCell sx={{ color: "text.primary" }}>{row.regional}</TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ color: "text.secondary" }}>
                    Sin registros
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </ThemeProvider>
  );
};

export default ListaAprendices;
