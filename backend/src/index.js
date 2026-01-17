import express from "express"
import Content from "./routes/auth.js"

const app = express()
app.use(Content)


app.use((req,res)=>{
    res.send(404).json({
        message:"Page not Found"
    })
})

const PORT = process.env.PORT || 3000

app.listen(PORT)