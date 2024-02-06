import  express  from "express";
import { signUp ,signIn, google, signOut, isRegister, sendotp} from "../controllers/auth.controller.js";

const router=express.Router()


router.post('/isRegister',isRegister)
router.post("/sentOtp",sendotp)
router.post("/sign-up",signUp)
router.post("/sign-in",signIn)
router.post('/google',google)
router.get("/sign-out",signOut)


export default router