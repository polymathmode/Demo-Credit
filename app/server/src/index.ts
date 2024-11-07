

import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import knex from './db/knex';
import userRouter from './routes/user.routes';
import walletRouter from "./routes/wallet.route"
import transactionRouter from "./routes/transactions.route"
import cors from 'cors'; 
import morgan from 'morgan';  

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9090;

// Middleware
app.use(cors());
app.use(express.json()); 
app.use(morgan('dev'));  
app.use(express.urlencoded({ extended: true })); 


app.get('/', (req: Request, res: Response) => {
    console.log('Received request for root route');
    res.status(200).json({
        success: true,
        message: 'Welcome to the Demo Credit API!!🎉🎉 Please test POST route handlers with Postman or curl using sample payload below',
        
         routes: {
    users: {
        url: 'https://demo-credit-5.onrender.com/api/user/create',
        method: 'POST',
        description: 'Create a new user',
        samplePayload: {
            "first_name": "Ricky Martin",
            "last_name": "password123",
            "email": "example@example.com",
            "password": "John",
            "phone": "+2347037110800",
            "date_of_birth": "1990-05-15",
            "address": "123 Osapa London",
            "city": "Lagos",
            "country": "Nigeria",
            "user_type": "borrower"
        }
     },
     wallets: {
        url: 'https://demo-credit-5.onrender.com/api/wallet/fundWallet/:user_id',
        method: 'POST',
        description: 'Fund user wallet by user_id',
        samplePayload: {
            "amount": 1000,
        }
    },
    transactions: {
        withdraw: {
            url: 'https://demo-credit-5.onrender.com/api/transaction/withdraw/:user_id',
            method: 'POST',
            description: 'Withdraw funds for user_id',
            samplePayload: {
                "amount": 500,
            }
        },
        
    },
    transfer: {
        url: 'https://demo-credit-5.onrender.com/api/transaction/transfer',
        method: 'POST',
        description: 'Transfer funds between users',
        samplePayload: {
            "senderId": 1,
            "receiverId": 2,
            "amount": 500
        }
    }
}
});
});

// API routes
app.use("/api/user", userRouter);  
app.use("/api/wallet", walletRouter);
app.use("/api/transaction", transactionRouter);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error occurred:', err.stack);
    res.status(500).json({
        success: false,
        message: 'An internal server error occurred',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.use((req: Request, res: Response) => {
    console.log(`Received request for route: ${req.path}`);
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Function to test database connection
async function checkDatabaseConnection() {
    try {
        await knex.raw('SELECT 1+1 AS result');
        console.log('✅ MySQL Database connected successfully.');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
}

// Start the server
if (require.main === module) {
    checkDatabaseConnection().then(() => {
        console.log(`Server is listening on port ${PORT}`);
        app.listen(PORT);
    });
}

export { app };