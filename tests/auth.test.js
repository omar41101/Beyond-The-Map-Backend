import request from 'supertest';
import { expect } from 'chai';
import app from '../server.js';
import User from '../models/User.js';
import connectDB from '../config/database.js';

describe('Authentication API', () => {
    let server;

    before(async () => {
        await connectDB();
        server = app.listen(0); // Random port for testing
    });

    after(async () => {
        await server.close();
    });

    beforeEach(async () => {
        await User.deleteMany({});
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'Test@123',
                    fullName: 'Test User',
                    phone: '+1234567890'
                });

            expect(res.status).to.equal(201);
            expect(res.body.success).to.be.true;
            expect(res.body).to.have.property('token');
            expect(res.body.user).to.have.property('email', 'test@example.com');
        });

        it('should reject weak passwords', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'weak',
                    fullName: 'Test User'
                });

            expect(res.status).to.equal(400);
            expect(res.body.success).to.be.false;
        });

        it('should reject duplicate email', async () => {
            await User.create({
                email: 'test@example.com',
                password: 'Test@123',
                fullName: 'Test User'
            });

            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'Test@123',
                    fullName: 'Another User'
                });

            expect(res.status).to.equal(400);
            expect(res.body.success).to.be.false;
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            await User.create({
                email: 'test@example.com',
                password: 'Test@123',
                fullName: 'Test User'
            });
        });

        it('should login with valid credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'Test@123'
                });

            expect(res.status).to.equal(200);
            expect(res.body.success).to.be.true;
            expect(res.body).to.have.property('token');
        });

        it('should reject invalid email', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'wrong@example.com',
                    password: 'Test@123'
                });

            expect(res.status).to.equal(401);
            expect(res.body.success).to.be.false;
        });

        it('should reject invalid password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'WrongPassword@123'
                });

            expect(res.status).to.equal(401);
            expect(res.body.success).to.be.false;
        });
    });

    describe('GET /api/auth/me', () => {
        let token;

        beforeEach(async () => {
            const user = await User.create({
                email: 'test@example.com',
                password: 'Test@123',
                fullName: 'Test User'
            });

            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'Test@123'
                });

            token = loginRes.body.token;
        });

        it('should get current user with valid token', async () => {
            const res = await request(app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).to.equal(200);
            expect(res.body.success).to.be.true;
            expect(res.body.user).to.have.property('email', 'test@example.com');
        });

        it('should reject request without token', async () => {
            const res = await request(app)
                .get('/api/auth/me');

            expect(res.status).to.equal(401);
            expect(res.body.success).to.be.false;
        });

        it('should reject invalid token', async () => {
            const res = await request(app)
                .get('/api/auth/me')
                .set('Authorization', 'Bearer invalid_token');

            expect(res.status).to.equal(401);
            expect(res.body.success).to.be.false;
        });
    });
});
