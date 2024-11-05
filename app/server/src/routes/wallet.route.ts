import { Router } from "express";
import {fundUserWallet} from "../controllers/wallets.controller"


const router=Router()


router.post('/fundWallet/:user_id', fundUserWallet)



export default router

