import { ContactService } from "../services/contactService"
import { identifyRequestSchema } from "../validation/schemas"
import { ZodError } from "zod"

export class ContactController {
  private contactService: ContactService

  constructor() {
    this.contactService = new ContactService()
  }

  identify = async (req: any, res: any): Promise<void> => {
    try {
      const validatedData = identifyRequestSchema.parse(req.body)
      const result = await this.contactService.identifyContact(validatedData.email, validatedData.phoneNumber)
      res.status(200).json(result)
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: "Validation failed",
          details: error.errors,
        })
        return
      }

      console.error("Error in identify endpoint:", error)
      res.status(500).json({
        error: "Internal server error",
        message: process.env.NODE_ENV === "development" ? (error as Error).message : "Something went wrong",
      })
    }
  }

  healthCheck = async (req: any, res: any): Promise<void> => {
    res.status(200).json({
      status: "OK",
      timestamp: new Date().toISOString(),
      service: "Bitespeed Identity Reconciliation",
    })
  }
}
