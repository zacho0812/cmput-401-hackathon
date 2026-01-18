import express from "express";
import Content from "./routes/content.js";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    if (req.body?.status === "NOT APPLIED" || req.body?.status === "Not Applied") {
        req.body.status = "NOT_APPLIED";
    }
    next();
});
app.use(Content);
const prisma = new PrismaClient();
app.post("/api/key", async (req, res) => {
    try {
        const { id } = req.body;
        if (id) {
            const existing = await prisma.user.findUnique({ where: { id } });
            if (existing) {
                return res.status(200).json({ id: existing.id, message: "user exists" });
            }
        }
        const user = await prisma.user.create({ data: {} });
        return res.status(200).json({ id: user.id, message: "user created" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "server error" });
    }
});
app.use((req, res) => {
    return res.status(404).json({
        message: "Page not Found"
    });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT);
//# sourceMappingURL=index.js.map