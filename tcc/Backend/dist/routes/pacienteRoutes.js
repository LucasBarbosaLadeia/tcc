"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pacienteController_1 = require("../controllers/pacienteController");
const router = (0, express_1.Router)();
router.post("/", pacienteController_1.createPaciente);
router.get("/", pacienteController_1.getAllPacientes);
router.get("/:id", pacienteController_1.getPacienteById);
router.put("/:id", pacienteController_1.updatePaciente);
router.delete("/:id", pacienteController_1.deletePaciente);
exports.default = router;
//# sourceMappingURL=pacienteRoutes.js.map