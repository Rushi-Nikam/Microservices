import express from "express";
import { registerOrganization, loginOrganization,verifyGst } from "../controllers/AuthControllers.js"; // ✅ Add .js

const router = express.Router();

router.post("/register", registerOrganization);
router.post("/login", loginOrganization);
router.get("/verify-gst/:gstNumber", verifyGst);

export default router;
