import { z } from "zod";
export declare const identifyRequestSchema: z.ZodEffects<z.ZodObject<{
    email: z.ZodOptional<z.ZodString>;
    phoneNumber: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    phoneNumber?: string | undefined;
    email?: string | undefined;
}, {
    phoneNumber?: string | undefined;
    email?: string | undefined;
}>, {
    phoneNumber?: string | undefined;
    email?: string | undefined;
}, {
    phoneNumber?: string | undefined;
    email?: string | undefined;
}>;
export type IdentifyRequestType = z.infer<typeof identifyRequestSchema>;
//# sourceMappingURL=schemas.d.ts.map