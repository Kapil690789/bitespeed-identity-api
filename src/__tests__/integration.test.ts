import request from "supertest"
import app from "@/app"

describe("Integration Tests", () => {
  describe("POST /identify", () => {
    it("should return 400 for invalid request body", async () => {
      const response = await request(app).post("/identify").send({})

      expect(response.status).toBe(400)
      expect(response.body.error).toBe("Validation failed")
    })

    it("should return 400 for invalid email format", async () => {
      const response = await request(app).post("/identify").send({
        email: "invalid-email",
        phoneNumber: "123456",
      })

      expect(response.status).toBe(400)
      expect(response.body.error).toBe("Validation failed")
    })

    it("should accept valid request with email only", async () => {
      const response = await request(app).post("/identify").send({
        email: "test@example.com",
      })

      // Note: This will fail without actual database, but structure is correct
      expect(response.status).toBe(200)
    })
  })

  describe("GET /health", () => {
    it("should return health status", async () => {
      const response = await request(app).get("/health")

      expect(response.status).toBe(200)
      expect(response.body.status).toBe("OK")
      expect(response.body.service).toBe("Bitespeed Identity Reconciliation")
    })
  })
})
