// const dotenv= require("dotenv") 
// dotenv.config()

// module.exports = {
//   development: {
//     client: 'mysql2',
//     connection: {
//       // host: 'localhost',
//       // user: 'root',
//       // password: '0967',
//       // database: 'democredit',
//       host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//       port: Number(process.env.DB_PORT) || 3306,
//       ssl: process.env.NODE_ENV === 'production' ? {rejectUnauthorized: true} : false

//     },
//     migrations: {
//       directory: './migrations',
//       extension: 'ts', 

//     },
//     seeds: {
//              directory: './seeds',         
//            },
//   },
// };
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  development: {
    client: 'mysql2',
    connection: process.env.DB_URL || {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT) || 3306,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : false
    },
    migrations: {
      directory: './migrations',
      extension: 'ts',
    },
    seeds: {
      directory: './seeds',
    },
  },
};
