import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = Router();
router.get("/api/listings", async (req, res) => {
    await prisma.user.create({
        data: {
            username: "karan1",
            password: "brar1"
        }
    });
});
router.post("/api/listings", (req, res) => {
});
router.get("/api/listings", (req, res) => {
});
export default router;
//# sourceMappingURL=content.js.map