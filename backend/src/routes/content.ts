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

//Logs for the specific jobs
router.get("/api/jobs/:jobId/logs", async (req, res) => {
  const { jobId } = req.params;

  try {
    const logs = await prisma.log.findMany({
      where: { jobid: jobId },
      orderBy: { id: "desc" }, // optional
    });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

router.post("/api/jobs/:jobId/logs", async (req, res) => {
  const { jobId } = req.params;
  const { title, desc } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const log = await prisma.log.create({
      data: {
        jobid: jobId,
        title,
        desc,
      },
    });

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ error: "Failed to create log" });
  }
});

router.delete("/api/logs/:logId", async (req, res) => {
  const { logId } = req.params;

  try {
    await prisma.log.delete({
      where: { id: logId },
    });

    res.json({ message: "Log deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete log" });
  }
});

export default router;
