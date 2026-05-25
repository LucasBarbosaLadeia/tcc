"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profissionalController_1 = require("../controllers/profissionalController");
const router = (0, express_1.Router)();
router.post("/", profissionalController_1.createProfissional);
router.get("/", profissionalController_1.getAllProfissionais);
router.get("/:id", profissionalController_1.getProfissionalById);
router.put("/:id", profissionalController_1.updateProfissional);
router.delete("/:id", profissionalController_1.deleteProfissional);
exports.default = router;
//# sourceMappingURL=profissionalRoutes.js.map