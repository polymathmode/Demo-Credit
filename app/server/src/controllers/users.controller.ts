

import { Request, Response, NextFunction } from 'express';
import { checkKarmaBlacklist } from '../utils/helpers';
import { createUser } from '../services/user.service';

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { first_name, last_name, email, password, phone, date_of_birth, address, city, state, country, user_type } = req.body;

    const isBlacklisted = await checkKarmaBlacklist(email);
    if (isBlacklisted) {
       res.status(403).json({ message: 'User is blacklisted' });
       return
    }

    const user = await createUser({ first_name, last_name, email, password, phone, date_of_birth, address, city, state, country, user_type });
    res.status(201).json({ message: 'User and wallet created successfully', user });
  } catch (error) {
    console.error('Error in registerUser controller:', error);
    next(error);
  }
};
