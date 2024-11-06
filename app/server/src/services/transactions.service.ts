import knex from '../db/knex';


interface Wallet {
  user_id: number;
  balance: number;
}

export async function transferFunds(senderId: number, receiverId: number, amount: number) {
  // Validate inputs
  if (!Number.isInteger(senderId) || !Number.isInteger(receiverId)) {
    throw new Error("Invalid sender or receiver ID");
  }
  
  if (amount <= 0) {
    throw new Error("Transfer amount must be positive");
  }

  if (senderId === receiverId) {
    throw new Error("Cannot transfer funds to the same wallet");
  }

  return await knex.transaction(async (trx) => {
    const senderWallet = await trx<Wallet>('wallets').where({ user_id: senderId }).first();
    const receiverWallet = await trx<Wallet>('wallets').where({ user_id: receiverId }).first();

    if (!senderWallet || !receiverWallet) {
      throw new Error("Invalid sender or receiver wallet");
    }

    if (senderWallet.balance < amount) {
      throw new Error("Insufficient funds");
    }

    // Deduct from sender
    await trx('wallets')
      .where({ user_id: senderId })
      .update({ balance: knex.raw('balance - ?', [amount]) });

    // Credit receiver
    await trx('wallets')
      .where({ user_id: receiverId })
      .update({ balance: knex.raw('balance + ?', [amount]) });

    // Fetch updated wallets
    const updatedSenderWallet = await trx('wallets').where({ user_id: senderId }).first();
    const updatedReceiverWallet = await trx('wallets').where({ user_id: receiverId }).first();

    return {
      message: "Funds transferred successfully",
      sender: updatedSenderWallet,
      receiver: updatedReceiverWallet
    };
  });
}

export const withdrawFundsFromWallet = async (userId:string, amount:number) => {
    const wallet = await knex('wallets').where({ user_id: userId }).first();
  
    if (!wallet) {
      throw new Error('Wallet not found');
    }
  
    if (wallet.balance < amount) {
      throw new Error('Insufficient funds');
    }
  
    const newBalance = wallet.balance - amount;
      // Start transaction for atomicity
await knex.transaction(async(trx)=>{
    await trx("wallets")
    .where({user_id:userId})
    .update({balance:newBalance,updated_at:trx.fn.now()})
// Log the withdrawal in the transactions table
await trx("transactions").insert({
    user_id:userId,
    type:"withdrawal",
    amount:amount,
    status:"completed",
    created_at:trx.fn.now(),
    updated_at:trx.fn.now(),
    destination:"external"
})
})
 
     return { balance: newBalance };
  };