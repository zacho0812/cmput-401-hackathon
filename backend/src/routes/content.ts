import { Router } from "express";
import {PrismaClient} from "@prisma/client"
import { de } from "zod/locales";

const router = Router();

const prisma = new PrismaClient()

//I have no clue if the URLS are right or not ngl 

router.get("/api/listings", async (req, res) => {
    const job_listings = await prisma.job.findMany({})
    res.json(job_listings)

});

router.post("/api/:userid/listings/add", async (req, res) => {
    const { position, company, location, deadline, status } = req.body
    const job_id: string = `${req.params["userid"]}${position}!`;

    const result = await prisma.job.create({
        data:{
            id:job_id,
            userid:req.params["userid"],
            companyName: company,
            positiontTitle:position,
            status: status,
            location: location,
            deadline: deadline,
            dateapplied: new Date(),
            notes: ""

    },

    })
    res.json(result)

});

router.patch("/api/listings/:id", async (req, res) => {
    const { position, company, location, deadline, status } = req.body

    const result = await prisma.job.update({
        where: {id:req.params["id"]},
        data:{
            companyName: company,
            positiontTitle:position,
            status: status,
            location: location,
            deadline: deadline,
            dateapplied: new Date(),
            notes: ""
        },
    })
    res.json(result)

});

router.delete("/api/listings/:id", async (req, res) => {
    const result = await prisma.job.delete({
        where: {id:req.params["id"]},
    })
    res.json(result)

});






router.get("/api/resume", async (req, res) => {
    const resumes = await prisma.resume.findMany({
        where: {}
    })
    res.json(resumes)

});

router.get("/api/:userid/resume", async (req, res) => {
    const resumes = await prisma.resume.findMany({
        where: { userid: req.params["userid"] }
    })
    console.log(resumes)
    res.json(resumes)
});


router.post(`/api/:userid/resume/:resumeid/add`, async (req, res) => {
    const { resume_data } = req.body

    const result = await prisma.resume.create({
    data:{
        id:req.params["resumeid"],
        userid:req.params["userid"],
        data:resume_data
    }

    })
    res.json(result)
})


router.patch("/api/:userid/resume/:resumeid/save", async (req, res) => {
    const {resume_data} = req.body

    const result = await prisma.resume.update({
        where: {id:req.params["resumeid"]},
        data:{
            userid:req.params["userid"],
            data:resume_data
        },
    })
    res.json(result)

});


router.delete("/api/:userid/resume/:resumeid/delete", async (req, res) => {

    const result = await prisma.resume.delete({
        where: {id:req.params["resumeid"]},
    })
    res.json(result)

});

router.get("/api/logs/:id", (req, res) => {



});

router.post("/api/logs/:id", (req, res) => {


    
});

router.delete("/api/logs/:id", (req, res) => {

});

export default router;
