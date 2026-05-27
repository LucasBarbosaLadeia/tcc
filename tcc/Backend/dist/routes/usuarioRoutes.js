"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuarioController_1 = require("../controllers/usuarioController");
const router = (0, express_1.Router)();
router.post("/", usuarioController_1.createUsuario);
router.get("/", usuarioController_1.getAllUsuarios);
router.get("/:id", usuarioController_1.getUsuarioById);
router.put("/:id", usuarioController_1.updateUsuario);
router.delete("/:id", usuarioController_1.deleteUsuario);
exports.default = router;
//# sourceMappingURL=usuarioRoutes.js.map