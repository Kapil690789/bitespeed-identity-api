import { z } from "zod"

export const identifyRequestSchema = z
  .object({
    email: z.string().email().optional(),
    phoneNumber: z.string().min(1).max(15).optional(),
  })
  .refine((data) => data.email || data.phoneNumber, {
    message: "At least one of email or phoneNumber must be provided",
  })

export type IdentifyRequestType = z.infer<typeof identifyRequestSchema>
