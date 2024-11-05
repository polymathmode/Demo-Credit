import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return  knex.schema.createTable('transactions', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable().references('id').inTable('users');
        table.enum('type', ['deposit', 'withdrawal', 'transfer']).notNullable();
        table.decimal('amount', 14, 2).notNullable();
        table.string('status').defaultTo('completed');
        table.string('destination').nullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
}


export async function down(knex: Knex): Promise<void> {
   return knex.schema.dropTableIfExists('transactions');
}

