
module.exports = {
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
      extension: 'ts', 

    },
    seeds: {
             directory: './seeds',         
           },
  },
};
