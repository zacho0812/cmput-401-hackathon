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

router.get("/api/resume", (req, res) => {


});

router.patch("/api/resume", (req, res) => {


});

router.get("/api/logs/:id", (req, res) => {



});

router.post("/api/logs/:id", (req, res) => {


    
});

router.delete("/api/logs/:id", (req, res) => {

});

export default router;
