import knex from '../db/knex';

export async function fundWallet(user_id: number, amount: number) {
  if (amount <= 0) {
    throw new Error('Amount must be positive');
  }

  // Fetch the user's wallet to check if it exists
  const wallet = await knex('wallets').where({ user_id }).first();
  if (!wallet) {
    throw new Error('Wallet not found for the user');
  }

//   // Update the wallet balance
//   const updatedWallet = await knex('wallets')
//     .where({ user_id })
//     .update({
//       balance: knex.raw('?? + ?', ['balance', amount]),
//       updated_at: knex.fn.now(),
//     })
//     .returning(['user_id', 'balance', 'updated_at']);

//   return updatedWallet[0];
// }
  // Update the balance without `returning`
  await knex('wallets')
    .where({ user_id })
    .increment('balance', amount)
    .update({ updated_at: knex.fn.now() });

  // Fetch the updated wallet to return
  const updatedWallet = await knex('wallets').where({ user_id }).first();
  return updatedWallet;
}
