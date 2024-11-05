// import bcrypt from 'bcrypt';
// import knex from '../db/knex'

// interface UserInput {
//   first_name: string;
//   last_name: string;
//   email: string;
//   password: string;
//   phone?: string;
//   date_of_birth?: string;
//   address?: string;
//   city?: string;
//   state?: string;
//   country?: string;
//   user_type?: 'borrower' | 'lender';
// }


// export async function createUser(data: UserInput) {
//     const hashedPassword = await bcrypt.hash(data.password, 10);
//     const newUser = {
//       first_name: data.first_name,
//       last_name: data.last_name,
//       email: data.email,
//       phone: data.phone,
//       date_of_birth: data.date_of_birth,
//       address: data.address,
//       city: data.city,
//       state: data.state,
//       country: data.country,
//       password: hashedPassword,
//       user_type: data.user_type || 'borrower',
//       is_blacklisted: false,
//     };
//     const [user] = await knex('users')
//       .insert(newUser)
//     return user;
//   }
  


// import bcrypt from 'bcrypt';
// import knex from '../db/knex';

// interface UserInput {
//   first_name: string;
//   last_name: string;
//   email: string;
//   password: string;
//   phone?: string;
//   date_of_birth?: string;
//   address?: string;
//   city?: string;
//   state?: string;
//   country?: string;
//   user_type?: 'borrower' | 'lender';
// }

// export async function createUser(data: UserInput) {
//   const hashedPassword = await bcrypt.hash(data.password, 10);
//   const newUser = {
//     first_name: data.first_name,
//     last_name: data.last_name,
//     email: data.email,
//     phone: data.phone,
//     date_of_birth: data.date_of_birth,
//     address: data.address,
//     city: data.city,
//     state: data.state,
//     country: data.country,
//     password: hashedPassword,
//     user_type: data.user_type || 'borrower',
//     is_blacklisted: false,
//   };

//   // Start a transaction to ensure both user and wallet are created together
//   return await knex.transaction(async (trx) => {
//     // Insert user
//     const [user] = await trx('users').insert(newUser).returning(['id', 'first_name', 'last_name', 'email']);
    
//     // Initialize wallet with balance 0
//     const newWallet = {
//       user_id: user.id,
//       balance: 0,
//       created_at: new Date(),
//       updated_at: new Date(),
//     };
//     await trx('wallets').insert(newWallet);

//     return user;
//   });
// }


import bcrypt from 'bcrypt';
import knex from '../db/knex';

interface UserInput {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
  date_of_birth?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  user_type?: 'borrower' | 'lender';
}

export async function createUser(data: UserInput) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const newUser = {
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    phone: data.phone,
    date_of_birth: data.date_of_birth,
    address: data.address,
    city: data.city,
    state: data.state,
    country: data.country,
    password: hashedPassword,
    user_type: data.user_type || 'borrower',
    is_blacklisted: false,
  };

  // Start a transaction to ensure both user and wallet are created together
  return await knex.transaction(async (trx) => {
    // Insert user and retrieve ID
    // const [user] = await trx('users').insert(newUser).returning(['id', 'first_name', 'last_name', 'email']);
    const [userId] = await knex('users').insert(newUser);

    // Ensure user ID is obtained before proceeding
    if (!userId) {
      throw new Error('Failed to create user: ID not returned');
    }
    
    // Create a wallet for the new user with an initial balance of 0
    await knex('wallets').insert({
      user_id: userId,
      balance: 0,
    });
    // await trx('wallets').insert(newWallet);
        // Retrieve the wallet information to include in the response
    const wallet = await knex('wallets').where({ user_id: userId }).first();
    return { id: userId, ...newUser,wallet };
  });
}

