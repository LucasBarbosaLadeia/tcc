"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const especialidadeController_1 = require("../controllers/especialidadeController");
const router = (0, express_1.Router)();
router.post("/", especialidadeController_1.createEspecialidade);
router.get("/", especialidadeController_1.getAllEspecialidades);
router.get("/:id", especialidadeController_1.getEspecialidadeById);
router.put("/:id", especialidadeController_1.updateEspecialidade);
router.delete("/:id", especialidadeController_1.deleteEspecialidade);
exports.default = router;
//# sourceMappingURL=especialidadeRoutes.js.map