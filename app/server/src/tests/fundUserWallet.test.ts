
import request from 'supertest';
import { app } from '../index';
import { faker } from '@faker-js/faker';
import knex from '../db/knex';

describe('Fund User Wallet Endpoint', () => {
  let userId: number;

  beforeAll(async () => {
    // Create a user and wallet for the test
    const userResponse = await request(app).post('/api/user/login').send({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      phone: faker.phone.number(),
      date_of_birth: faker.date.past().toISOString().slice(0, 10),      address: faker.address.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: 'Nigeria',
      user_type: 'borrower'
    });
    userId = userResponse.body.user.id;
  });

  it('should fund the user wallet successfully', async () => {
    const fundPayload = { amount: 100 };

    const response = await request(app)
      .post(`/api/wallet/fundWallet/${userId}`)
      .send(fundPayload);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Wallet funded successfully');
    expect(response.body.wallet).toHaveProperty('user_id', userId);
    expect(Number(response.body.wallet.balance)).toBeGreaterThanOrEqual(fundPayload.amount);
  });

  it('should return an error if the amount is not a positive number', async () => {
    const fundPayload = { amount: -500 };

    const response = await request(app)
      .post(`/api/wallet/fundWallet/${userId}`)
      .send(fundPayload);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Amount must be a positive number');
  });

  it('should return an error if the wallet does not exist for the user', async () => {
    const nonExistentUserId = 99999; // Assuming this user ID doesn’t exist
    const fundPayload = { amount: 100 };

    const response = await request(app)
      .post(`/api/wallet/fundWallet/${nonExistentUserId}`)
      .send(fundPayload);

    expect(response.status).toBe(404); // Now expecting a 404 status
    expect(response.body.message).toBe('Wallet not found for the user');
  });
  afterAll(async () => {
    await knex.destroy(); 
});
});

