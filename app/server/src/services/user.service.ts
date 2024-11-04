import bcrypt from 'bcrypt';
import knex from '../db/knex'

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
    const [user] = await knex('users')
      .insert(newUser)
    return user;
  }
  