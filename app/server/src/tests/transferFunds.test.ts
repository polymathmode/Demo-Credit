
import request from 'supertest';
import { app } from '../index';
import knex from '../db/knex';
import { faker } from '@faker-js/faker';

describe('Transfer Funds Endpoint', () => {
    let senderId: number;
    let receiverId: number;

    beforeAll(async () => {
        // Create sender with sufficient initial balance
        const senderResponse = await request(app).post('/api/user/create').send({
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
            user_type: 'borrower'
        });
        senderId = senderResponse.body.user.id;

        // Fund sender's wallet with enough balance
        await request(app).post(`/api/wallet/fundWallet/${senderId}`).send({ amount: 1000 });

        // Create receiver
        const receiverResponse = await request(app).post('/api/user/create').send({
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
            user_type: 'borrower'
        });
        receiverId = receiverResponse.body.user.id;
    });

    it('should transfer funds successfully from sender to receiver', async () => {
        const transferPayload = { senderId, receiverId, amount: 200 };

        const response = await request(app).post('/api/transaction/transfer').send(transferPayload);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Funds transferred successfully');

        // Verify sender's balance is deducted
        const senderWallet = await knex('wallets').where({ user_id: senderId }).first();
        expect(Number(senderWallet.balance)).toBeGreaterThanOrEqual(800);

        // Verify receiver's balance is credited
        const receiverWallet = await knex('wallets').where({ user_id: receiverId }).first();
        expect(Number(receiverWallet.balance)).toBeGreaterThanOrEqual(200);
    });

    it('should return an error if sender and receiver are the same', async () => {
        const transferPayload = { senderId, receiverId: senderId, amount: 100 };

        const response = await request(app).post('/api/transaction/transfer').send(transferPayload);
   console.log('Sending transfer request...');

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Cannot transfer funds to the same wallet");
    });

    it('should return an error if sender has insufficient funds', async () => {
        const transferPayload = { senderId, receiverId, amount: 10000 };

        const response = await request(app).post('/api/transaction/transfer').send(transferPayload);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Insufficient funds");
    });

    it('should return an error if either wallet does not exist', async () => {
        const invalidUserId = 99999; 
        const transferPayload = { senderId: invalidUserId, receiverId, amount: 100 };

        const response = await request(app).post('/api/transaction/transfer').send(transferPayload);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Invalid sender or receiver wallet");
    });

    afterAll(async () => {
        await knex.destroy();
    });
});

