import { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql2',
    connection: {
      host: 'localhost',            
      user: 'root',         
      password: '0967',             
      database: 'democredit',       
    },
    migrations: {
      directory: './migrations',    
    },
    seeds: {
      directory: './seeds',         
    },
  },
};

export default config;
