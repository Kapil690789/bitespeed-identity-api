import { Router } from "express"
import { ContactController } from "../controllers/contactController"

const router = Router()
const contactController = new ContactController()

router.post("/identify", contactController.identify)
router.get("/health", contactController.healthCheck)

export default router
