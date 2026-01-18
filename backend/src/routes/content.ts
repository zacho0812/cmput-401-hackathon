import { Router } from "express";
import {PrismaClient} from "@prisma/client"
import { da } from "zod/locales";
import { jsonToResumeLatex } from "../utils/json2latex.js";
import latex from "node-latex";
import { JsxEmit } from "typescript";
import fs from "fs";

const router = Router();

const prisma = new PrismaClient()

router.get("/api/jobs", async (req, res) => {
    try{
        let user = req.header("user-id");
        if(!user){
            return res.status(400).json({
            message:"required data not provided"
        })

        }

        let listings = await prisma.user.findMany({
            where:{
               id:user
            },
            include:{
                jobs:true
            }
        }) 

        return res.status(200).json({
            data:listings

        })

        

    } catch(err){
        return res.status(500).json({
            message:"server error"
        })
    }

});

router.post("/api/jobs", async (req, res) => {
    try{
        let user = req.header("user-id");
        if(!user || !req.body.positionTitle ||!req.body.companyName ){
            return res.status(400).json({
            message:"required data not provided"
        })

        }

        const job = await prisma.job.create({
            data:{
                userid:user,
                positionTitle:req.body.positionTitle,
                companyName:req.body.companyName,
                dateapplied:req.body.dateapplied? req.body.dateapplied:Date.now(),
                location: req.body.location?req.body.location:null,
                deadline: req.body.deadline?req.body.deadline:null,
                notes: req.body.notes?req.body.notes:null,
                status:req.body.status
            }
        })    
        return res.status(200).json({
            id:job.id,
            message:"job created succesfully"
        })

    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            message:"server error"
        })
    }




});

router.patch("/api/jobs", async (req, res) => {
    try{
        let user = req.header("user-id");
        if(!user || !req.body.positionTitle ||!req.body.companyName || !req.body.jobid){
            return res.status(400).json({
            message:"required data not provided"
        })

        }

        await prisma.job.update({
            where:{id:req.body.jobid},
            data:{
                userid:user,
                positionTitle:req.body.positionTitle,
                companyName:req.body.companyName,
                dateapplied:req.body.dateapplied? req.body.dateapplied:null,
                location: req.body.location?req.body.location:null,
                deadline: req.body.deadline?req.body.deadline:null,
                notes: req.body.notes?req.body.notes:null,
                status:req.body.status
            }
        })    

         return res.status(200).json({
            message:"job updated succesfully"
        })

    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            message:"server error"
        })
    }


});

router.delete("/api/jobs", async (req, res) => {
    try{
         let user = req.header("user-id");
        if(!user || !req.body.id){
            return res.status(400).json({
            message:"required data not provided"
        })

        }

        await prisma.job.delete({
            where:{
                id:req.body.id
            }
        })
        
        return res.status(200).json({
            message:"job deleted succesfully"
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            message:"server error"
        })
    }


});

router.get("/api/resume", async (req, res) => {
    try{
        let user = req.header("user-id");
        if(!user){
            return res.status(400).json({
            message:"required data not provided"
        })

        }

        const data = await prisma.resume.findMany({
            where:{
                userid:user
            }
        })

        return res.status(200).json({
            data:data,
            message:"resume's fetched succesfully"
        })

    }
    catch(err){
        return res.status(500).json({
            message:"server error"
        })
    }


});




router.patch("/api/resume", async (req, res) => {
    try{
         let user = req.header("user-id");
        if(!user || !req.body.data || !req.body.id){
            return res.status(400).json({
            message:"required data not provided"
        })
        }
        
         const id = await prisma.resume.update({
            where:{
                userid:user,
                id:req.body.id
            },
            data:{
                userid:user,
                data:req.body.data,
                master:req.body.master
            }
        })

        return res.status(200).json({
            id:id,
            message:"resume updated succesfully"
        })
        


    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            message:"server error"
        })
    }


});

router.post("/api/resume", async (req, res) => {
    try{
         let user = req.header("user-id");
        if(!user || !req.body.data){
            return res.status(400).json({
            message:"required data not provided"
        })
        }

        const id = await prisma.resume.create({
            data: { userid: user, data: req.body.data , master: req.body.master}
        });


        return res.status(200).json({
            id:id,
            message:"resume updated succesfully"
        })
        


    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            message:"server error"
        })
    }


});


router.get("/api/logs", async (req, res) => {
    try{
       let user = req.header("user-id");
        if(!user){
            return res.status(400).json({
            message:"required data not provided"
        })

        }

        const logs = await prisma.user.findFirst({
            where:{
                id:user
            },
            include:{
                logs:true
            }
        })

        return res.status(200).json({
            logs:logs,
            message:"logs fetched succesfully"
        })


    }
    catch(err){
        return res.status(500).json({
            message:"server error"
        })
    }



});

router.post("/api/logs", async (req, res) => {
    try{
       let user = req.header("user-id");
        if(!user || !req.body.jobid || !req.body.title){
            return res.status(400).json({
            message:"required data not provided"
        })

        }

        const logs = await prisma.log.create({
            data:{
                userid:user,
                title:req.body.title,
                desc:req.body.desc? req.body.desc:null
            }
        })

        return res.status(200).json({
            logs:logs.id,
            message:"logs created succesfully"
        })


    }
    catch(err){
        return res.status(500).json({
            message:"server error"
        })
    }


    
});

router.delete("/api/logs", async (req, res) => {
    try{
        let user = req.header("user-id");
        if(!user || !req.body.id){
            return res.status(400).json({
            message:"required data not provided"
        })

        }

        const logs = await prisma.log.delete({
            where:{
                id:req.body.id
            },
            
        })

        return res.status(200).json({
            message:"logs deleted succesfully"
        })


    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            message:"server error"
        })
    }

});


router.post("/api/resume/pdf",async (req,res)=>{
     try{
        let user = req.header("user-id");
        if(!user ){
            return res.status(400).json({
            message:"required data not provided"
        })

        }
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
        "Content-Disposition",
        "attachment; filename=resume.pdf"
        );
        const json = typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data;


        const latexSource = await jsonToResumeLatex(json)
        
        await fs.writeFileSync("debug_resume.tex", latexSource, "utf8");
        //@ts-ignore
        const pdfStream = await latex(latexSource, {
        });

        pdfStream.on("error", (err:any) => {
            console.error("LaTeX compile error:", err);
            if (!res.headersSent) res.status(500);
            res.end("LaTeX compile failed");
        });

        // Stream PDF directly to the response
        pdfStream.pipe(res);
        


    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            message:"server error"
        })
    }


})


export default router;
