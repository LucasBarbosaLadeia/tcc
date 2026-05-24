import express from "express";
import cors from "cors";

import usuarioRoutes from "./routes/usuarioRoutes";
import agendamentoRoutes from "./routes/agendamentoRoutes";
import dataRoutes from "./routes/horarioRoutes";
import especialidadeRoutes from "./routes/especialidadeRoutes";
import unidadeRoutes from "./routes/unidadeRoutes";
import pacienteRoutes from "./routes/pacienteRoutes";
import agendaRoutes from "./routes/agendaRoutes";
import profissionalRoutes from "./routes/profissionalRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Small test helper: allow tests to set req.user via header `x-user` containing JSON
app.use((req, _res, next) => {
  const u = req.header("x-user");
  if (u) {
    try {
      (req as any).user = JSON.parse(u as string);
    } catch (e) {
      // ignore parse errors
    }
  }
  next();
});

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/agendamentos", agendamentoRoutes);
app.use("/api/datas", dataRoutes);
app.use("/api/especialidades", especialidadeRoutes);
app.use("/api/unidades", unidadeRoutes);
app.use("/api/pacientes", pacienteRoutes);
app.use("/api/agendas", agendaRoutes);
app.use("/api/profissionais", profissionalRoutes);

app.get("/", (req, res) => {
  res.json({ message: "api funcional", api: "Acesse /api para ver os endpoints disponíveis" });
});

export default app;
