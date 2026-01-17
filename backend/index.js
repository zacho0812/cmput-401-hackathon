// backend/index.js
import express from "express"
import cors from "cors"
import notificationRoutes from "./routes/notificationRoutes.js"

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Your existing route
app.get("/", (req, res) => {
    res.json({
        message: "hi there"
    })
})

// Notification routes
app.use("/api/notifications", notificationRoutes)

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000")
})