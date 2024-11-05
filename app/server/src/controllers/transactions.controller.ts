import { Request, Response, NextFunction } from 'express';
import { transferFunds,withdrawFundsFromWallet } from '../services/transactions.service';

export const transferFundsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { senderId, receiverId, amount } = req.body;

    const result = await transferFunds(senderId, receiverId, amount);
    res.status(200).json(result);
  } catch (error:any) {
    console.error("Error in transferFundsController:", error);
    res.status(400).json({ error: error.message });
  }
};



export const withdrawFundsController = async (req: Request, res: Response) => {
    try {
      const { user_id } = req.params;
      const { amount } = req.body;
  
      const result = await withdrawFundsFromWallet(user_id, amount);
  
      res.status(200).json({
        message: 'Withdrawal successful',
        balance: result.balance,
      });
    } catch (error:any) {
      console.error('Error in withdrawFunds controller:', error);
      res.status(400).json({ message: error.message });
    }
  };