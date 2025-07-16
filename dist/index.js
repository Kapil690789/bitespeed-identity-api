"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = __importDefault(require("./config/database"));
const PORT = process.env.PORT || 3000;
async function startServer() {
    try {
        await database_1.default.$connect();
        console.log("✅ Database connected successfully");
        app_1.default.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📍 Health check: http://localhost:${PORT}/health`);
            console.log(`📍 API endpoint: http://localhost:${PORT}/identify`);
        });
    }
    catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
}
process.on("SIGINT", async () => {
    console.log("\n🛑 Shutting down server...");
    await database_1.default.$disconnect();
    process.exit(0);
});
startServer();
//# sourceMappingURL=index.js.map