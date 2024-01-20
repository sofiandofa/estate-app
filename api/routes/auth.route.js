import  express  from "express";
import { signUp } from "../controllers/auth.controller.js";

const router=express.Router()


router.get("/sign-in",signUp)


export default router