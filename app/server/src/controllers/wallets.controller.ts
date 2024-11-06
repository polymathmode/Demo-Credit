import { Request, Response, NextFunction } from 'express';
import { fundWallet } from '../services/wallets.service';

export const fundUserWallet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount } = req.body;
    const user_id = req.params.user_id; // Assuming the user_id is passed as a URL parameter

    if (!amount || typeof amount !== 'number') {
       res.status(400).json({ message: 'Amount must be a positive number' });
       return
    }

    const updatedWallet = await fundWallet(Number(user_id), amount);
    res.status(200).json({
      message: 'Wallet funded successfully',
      wallet: updatedWallet,
    });

} catch (error:any) {
  if (error.message === 'Wallet not found for the user') {
     res.status(404).json({ message: 'Wallet not found for the user' });
     return
  } else if (error.message === 'Amount must be positive') {
     res.status(400).json({ message: 'Amount must be a positive number' });
     return
  }
  console.error('Error funding wallet:', error);
  next(error); // General error handling
}
};
