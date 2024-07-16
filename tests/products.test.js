const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/user');
const Product = require('../models/product');
let token;

beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_HOST, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    await request(app)
        .post('/api/auth/register')
        .send({
            username: 'productuser',
            password: 'password123'
        });

    const res = await request(app)
        .post('/api/auth/login')
        .send({
            username: 'productuser',
            password: 'password123'
        });

    token = res.body.token;
});

afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
});

describe('Product Management', () => {
    it('should create a new product', async () => {
        const res = await request(app)
            .post('/api/products')
            .set('x-auth-token', token)
            .send({
                name: 'Test Product',
                price: 100
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Product created successfully');
        expect(res.body.product).toHaveProperty('name', 'Test Product');
    });

    it('should get all products', async () => {
        await request(app)
            .post('/api/products')
            .set('x-auth-token', token)
            .send({
                name: 'Test Product 2',
                price: 200
            });

        const res = await request(app)
            .get('/api/products')
            .set('x-auth-token', token);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('products');
        expect(res.body.products.length).toBeGreaterThan(0);
    });

    it('should not create a product without a token', async () => {
        const res = await request(app)
            .post('/api/products')
            .send({
                name: 'Test Product',
                price: 100
            });

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message', 'No token, authorization denied');
    });

    it('should not get products without a token', async () => {
        const res = await request(app)
            .get('/api/products');

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message', 'No token, authorization denied');
    });
});
