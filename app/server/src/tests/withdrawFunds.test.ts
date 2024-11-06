import request from 'supertest';
import { app } from '../index';
import knex from '../db/knex';
import { faker } from '@faker-js/faker';

describe('Withdraw Funds Endpoint', () => {

    let userId: number;

    beforeAll(async () => {
        // Create a user
        const userPayload = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            phone: faker.string.numeric(10),
            date_of_birth: faker.date.past().toISOString().slice(0, 10),
            address: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            country: 'Nigeria',
            user_type: 'borrower',
        };

        const userResponse = await request(app).post('/api/user/create').send(userPayload);
        userId = userResponse.body.user.id;

        // Fund the user's wallet
        const fundPayload = { amount: 1000 };
        await request(app).post(`/api/wallet/fundWallet/${userId}`).send(fundPayload);
    });

    it('should successfully withdraw funds from the user wallet', async () => {
        const withdrawalPayload = { amount: 200 };

        const response = await request(app)
            .post(`/api/transaction/withdraw/${userId}`)
            .send(withdrawalPayload);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Withdrawal successful');
        expect(response.body).toHaveProperty('balance');

        // Verify the balance is updated correctly
        const wallet = await knex('wallets').where({ user_id: userId }).first();
        expect(Number(wallet.balance)).toBe(800); 
    });

    it('should return an error if withdrawal amount exceeds wallet balance', async () => {
        const withdrawalPayload = { amount: 2000 }; 

        const response = await request(app)
            .post(`/api/transaction/withdraw/${userId}`)
            .send(withdrawalPayload);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Insufficient funds');
    });

    it('should return an error if the wallet does not exist', async () => {
        const invalidUserId = 99999;
        const withdrawalPayload = { amount: 100 };

        const response = await request(app)
            .post(`/api/transaction/withdraw/${invalidUserId}`)
            .send(withdrawalPayload);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Wallet not found');
    });

    afterAll(async () => {
        await knex.destroy();
    });
});
