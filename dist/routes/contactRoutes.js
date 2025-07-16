"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contactController_1 = require("../controllers/contactController");
const router = (0, express_1.Router)();
const contactController = new contactController_1.ContactController();
router.post("/identify", contactController.identify);
router.get("/health", contactController.healthCheck);
exports.default = router;
//# sourceMappingURL=contactRoutes.js.map