
import request from 'supertest';
import { app } from '../index'; 

describe('User Registration Endpoint', () => {
    it('should create a new user and wallet successfully', async () => {
        const userPayload = {
            first_name: 'Jogo',
            last_name: 'Isaaca',
            email: 'fountain@example.com',
            password: 'gosling',
            phone: '+2347037117653',
            date_of_birth: '1990-05-15',
            address: '123 Example Street',
            city: 'Lagos',
            state: 'Lagos',
            country: 'Nigeria',
            user_type: 'borrower'
        };

        const response = await request(app)
            .post('/api/user/login')
            .send(userPayload);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User and wallet created successfully');
        expect(response.body.user).toHaveProperty('id');
        expect(response.body.user.wallet).toHaveProperty('balance', "0.00");
        
    });
});
