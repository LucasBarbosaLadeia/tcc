import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import usuarioRoutes from "./routes/usuarioRoutes";
import agendamentoRoutes from "./routes/agendamentoRoutes";
import dataRoutes from "./routes/horarioRoutes";
import especialidadeRoutes from "./routes/especialidadeRoutes";
import unidadeRoutes from "./routes/unidadeRoutes";
import pacienteRoutes from "./routes/pacienteRoutes";
import agendaRoutes from "./routes/agendaRoutes";
import profissionalRoutes from "./routes/profissionalRoutes";
import authRoutes from "./routes/authRoutes";
import swaggerSpec from "./config/swagger";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/agendamentos", agendamentoRoutes);
app.use("/api/datas", dataRoutes);
app.use("/api/especialidades", especialidadeRoutes);
app.use("/api/unidades", unidadeRoutes);
app.use("/api/pacientes", pacienteRoutes);
app.use("/api/agendas", agendaRoutes);
app.use("/api/profissionais", profissionalRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "api funcional",
    api: "Acesse /api para ver os endpoints disponíveis",
  });
});

app.get("/api", (_req, res) => {
  res.json({
    endpoints: [
      "/api/enderecos",
      "/api/usuarios",
      "/api/agendamentos",
      "/api/datas",
      "/api/especialidades",
      "/api/unidades",
      "/api/pacientes",
      "/api/agendas",
      "/api/profissionais",
      "/api/auth/login",
    ],
  });
});

app.get("/health", (_req, res) => {
  res.json({
    status: "OK",
    database: "Connected",
    timestamp: new Date().toISOString(),
  });
});

export default app;
