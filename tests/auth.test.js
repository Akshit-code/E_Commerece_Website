const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/user');

beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_HOST, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
});

describe('Authentication', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                password: 'password123'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Registration successful');
        expect(res.body.user).toHaveProperty('username', 'testuser');
    });

    it('should not register a user with an existing username', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                password: 'password123'
            });

        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                password: 'password123'
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Username already taken');
    });

    it('should login a user', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({
                username: 'loginuser',
                password: 'password123'
            });

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                username: 'loginuser',
                password: 'password123'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Login successful');
        expect(res.body).toHaveProperty('token');
    });

    it('should not login a user with incorrect credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                username: 'nonexistentuser',
                password: 'wrongpassword'
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });
});
