import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', (table) => {
        table.increments('id').primary();                 // Unique ID for each user
        table.string('first_name', 100).notNullable();    // First name of the user
        table.string('last_name', 100).notNullable();     // Last name of the user
        table.string('email', 100).unique().notNullable(); // Unique email
        table.string('phone', 20).unique().notNullable();  // Unique phone number
        table.date('date_of_birth').notNullable();        // Date of birth, for age verification
        table.string('address').notNullable();            // Address for verification
        table.string('city').notNullable();               // City of residence
        table.string('state').notNullable();              // State of residence
        table.string('country').notNullable();            // Country of residence
        table.string('password').notNullable();           // Password for login, hashed
        table.enum('user_type', ['borrower', 'lender']).notNullable(); // Type of user
        table.boolean('is_blacklisted').defaultTo(false); // Blacklisted status
        table.timestamp('created_at').defaultTo(knex.fn.now()); // Account creation timestamp
        table.timestamp('updated_at').defaultTo(knex.fn.now()); // Last update timestamp
      });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('users');

}

