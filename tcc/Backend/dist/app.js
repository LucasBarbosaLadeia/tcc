"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const usuarioRoutes_1 = __importDefault(require("./routes/usuarioRoutes"));
const agendamentoRoutes_1 = __importDefault(require("./routes/agendamentoRoutes"));
const horarioRoutes_1 = __importDefault(require("./routes/horarioRoutes"));
const especialidadeRoutes_1 = __importDefault(require("./routes/especialidadeRoutes"));
const unidadeRoutes_1 = __importDefault(require("./routes/unidadeRoutes"));
const pacienteRoutes_1 = __importDefault(require("./routes/pacienteRoutes"));
const agendaRoutes_1 = __importDefault(require("./routes/agendaRoutes"));
const profissionalRoutes_1 = __importDefault(require("./routes/profissionalRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const swagger_1 = __importDefault(require("./config/swagger"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
app.use("/api/usuarios", usuarioRoutes_1.default);
app.use("/api/agendamentos", agendamentoRoutes_1.default);
app.use("/api/datas", horarioRoutes_1.default);
app.use("/api/especialidades", especialidadeRoutes_1.default);
app.use("/api/unidades", unidadeRoutes_1.default);
app.use("/api/pacientes", pacienteRoutes_1.default);
app.use("/api/agendas", agendaRoutes_1.default);
app.use("/api/profissionais", profissionalRoutes_1.default);
app.use("/api/auth", authRoutes_1.default);
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
exports.default = app;
//# sourceMappingURL=app.js.map