
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import knex from '../src/db/knex'; 

dotenv.config();

const app = express();

const PORT = process.env.PORT || 9090;

// Function to test database connection
async function checkDatabaseConnection() {
  try {
    // Run a simple query to confirm the connection
    await knex.raw('SELECT 1+1 AS result');
    console.log('✅ MySQL Database connected successfully.');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1); 
  }
}

// Start the server after confirming the database connection
async function startServer() {
  await checkDatabaseConnection();

  app.get('/', (req: Request, res: Response) => {
    res.send(`Hello mami!`);
  });

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}

startServer();
