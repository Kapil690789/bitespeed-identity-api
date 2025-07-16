"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/", contactRoutes_1.default);
app.use((req, res) => {
    res.status(404).json({
        error: "Not found",
        message: `Route ${req.method} ${req.path} not found`,
    });
});
app.use((error, req, res, next) => {
    console.error("Unhandled error:", error);
    res.status(500).json({
        error: "Internal server error",
        message: process.env.NODE_ENV === "development" ? error.message : "Something went wrong",
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map