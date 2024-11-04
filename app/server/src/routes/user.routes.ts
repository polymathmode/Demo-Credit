import { Router } from "express";
import {registerUser} from "../controllers/users.controller"


const router=Router()


router.post('/login', registerUser)



export default router

