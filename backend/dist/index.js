import express from "express";
import Content from "./routes/content.js";
import { PrismaClient } from "@prisma/client";
const app = express();
app.use(express.json());
app.use(Content);
const prisma = new PrismaClient();
app.post("/", async (req, res) => {
    try {
        const user = await prisma.user.create({
            data: {}
        });
        return res.status(200).json({
            id: user.id,
            message: "user created"
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "server error"
        });
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