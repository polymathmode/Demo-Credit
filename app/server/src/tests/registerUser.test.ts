import request from 'supertest';
import { app } from '../index'; 
import { faker } from '@faker-js/faker';
import knex from '../db/knex';

describe('User Registration Endpoint', () => {
  it('should create a new user and wallet successfully', async () => {
    const userPayload = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      phone: faker.phone.number(),
      date_of_birth: faker.date.past().toISOString().slice(0, 10),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
      user_type: 'borrower',
    };

    const response = await request(app)
      .post('/api/user/create')
      .send(userPayload);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User and wallet created successfully');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user.wallet).toHaveProperty('balance', '0.00');
  });
  afterAll(async () => {
    await knex.destroy();
});
});