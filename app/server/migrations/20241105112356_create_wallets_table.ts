import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("wallets", (table) => {
        table.increments("id").primary();                 // Unique ID for each wallet
        table.integer("user_id").unsigned().notNullable().unique(); // Each wallet is linked to a unique user
        table.decimal("balance", 12, 2).notNullable().defaultTo(0); // Balance with 2 decimal precision
        table.timestamp("created_at").defaultTo(knex.fn.now());     // Wallet creation timestamp
        table.timestamp("updated_at").defaultTo(knex.fn.now());     // Last update timestamp
        // Foreign key constraint linking wallets to users
        table.foreign("user_id").references("id").inTable("users").onDelete("CASCADE");
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("wallets");
}

