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

// Middleware
app.use(cors());  
app.use(morgan('dev'));  
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// API routes
app.use("/api/user", userRouter);  
app.use("/api/wallet",walletRouter)
app.use("/api/transaction",transactionRouter)

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'An internal server error occurred',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Handle 404 routes
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

const PORT = process.env.PORT  || 3000; 


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

export { app };


// Start the server if running directly
if (require.main === module) {
    const PORT = process.env.PORT || 9090;
    checkDatabaseConnection().then(() => {
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    });
}
