import Knex from 'knex';
const knexConfig = require('../../knexfile');

// Initialize Knex with the development configuration
const knex = Knex(knexConfig.development);

export default knex;
