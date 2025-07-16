"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.identifyRequestSchema = void 0;
const zod_1 = require("zod");
exports.identifyRequestSchema = zod_1.z
    .object({
    email: zod_1.z.string().email().optional(),
    phoneNumber: zod_1.z.string().min(1).max(15).optional(),
})
    .refine((data) => data.email || data.phoneNumber, {
    message: "At least one of email or phoneNumber must be provided",
});
//# sourceMappingURL=schemas.js.map