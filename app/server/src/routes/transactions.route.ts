import { Router } from 'express';
import { transferFundsController, withdrawFundsController } from '../controllers/transactions.controller';

const router = Router();

router.post('/transfer', transferFundsController);
router.post('/withdraw/:user_id', withdrawFundsController);


export default router;
