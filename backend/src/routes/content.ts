import { Router } from "express";
import {PrismaClient} from "@prisma/client"

const router = Router();

const prisma = new PrismaClient()

router.get("/api/listings", (req, res) => {
    


});

router.post("/api/listings", (req, res) => {


});

router.patch("/api/listings/:id", (req, res) => {


});

router.delete("/api/listings/:id", (req, res) => {


});

router.get("/api/resume", async (req, res) => {
    const resumes = await prisma.resume.findMany({
        where: {}
    })
    res.json(resumes)

});

router.get("/api/:userId/resume", async (req, res) => {
    const resumes = await prisma.resume.findMany({
        where: { userid: req.params["userId"] }
    })
    console.log(resumes)
    res.json(resumes)
});


router.post(`/api/:userId/resume/:resumeId/add`, async (req, res) => {
    const { resume_data } = req.body

    const result = await prisma.resume.create({
    data:{
        id:req.params["userId"],
        userid:req.params["userId"],
        data:resume_data
    }

    })
    res.json(result)
})


router.patch("/api/:userId/resume/:resumeId/save", async (req, res) => {
    const resume_data = req.body

    const result = await prisma.resume.update({
        where: {id:req.params["userId"]},
        data:{
            userid:req.params["userId"],
            data:resume_data
        },
    })
    res.json(result)

});

router.get("/api/logs/:id", (req, res) => {
    const jobId = req.params.jobid;
    try {
        const logs = await prisma.log.findMany({
            where: { jobid: jobId },
            orderBy: { id: 'asc' } // or another order if needed
        });
        res.json(logs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch logs" });
    }
});

router.post("/api/logs/:id", (req, res) => {


    
});

router.delete("/api/logs/:id", (req, res) => {

});

export default router;
