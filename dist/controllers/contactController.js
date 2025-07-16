"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactController = void 0;
const contactService_1 = require("../services/contactService");
const schemas_1 = require("../validation/schemas");
const zod_1 = require("zod");
class ContactController {
    constructor() {
        this.identify = async (req, res) => {
            try {
                const validatedData = schemas_1.identifyRequestSchema.parse(req.body);
                const result = await this.contactService.identifyContact(validatedData.email, validatedData.phoneNumber);
                res.status(200).json(result);
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    res.status(400).json({
                        error: "Validation failed",
                        details: error.errors,
                    });
                    return;
                }
                console.error("Error in identify endpoint:", error);
                res.status(500).json({
                    error: "Internal server error",
                    message: process.env.NODE_ENV === "development" ? error.message : "Something went wrong",
                });
            }
        };
        this.healthCheck = async (req, res) => {
            res.status(200).json({
                status: "OK",
                timestamp: new Date().toISOString(),
                service: "Bitespeed Identity Reconciliation",
            });
        };
        this.contactService = new contactService_1.ContactService();
    }
}
exports.ContactController = ContactController;
//# sourceMappingURL=contactController.js.map