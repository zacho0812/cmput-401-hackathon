import express from "express"

const app = express()


app.get("/",(req,res)=>{
    res.json({
        message:"hi there"
    })
})

app.listen(3000)