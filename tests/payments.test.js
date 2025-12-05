import request from 'supertest';
import { expect } from 'chai';
import app from '../server.js';
import User from '../models/User.js';
import Tour from '../models/Tour.js';
import Booking from '../models/Booking.js';
import connectDB from '../config/database.js';

describe('Payments API', () => {
    let server;
    let userToken;
    let user;
    let booking;

    before(async () => {
        await connectDB();
        server = app.listen(0);
    });

    after(async () => {
        await server.close();
    });

    beforeEach(async () => {
        await User.deleteMany({});
        await Tour.deleteMany({});
        await Booking.deleteMany({});

        const agency = await User.create({
            email: 'agency@test.com',
            password: 'Agency@123',
            fullName: 'Test Agency',
            role: 'agency'
        });

        user = await User.create({
            email: 'user@test.com',
            password: 'User@123',
            fullName: 'Test User',
            role: 'user'
        });

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'user@test.com',
                password: 'User@123'
            });

        userToken = loginRes.body.token;

        const tour = await Tour.create({
            name: 'Test Tour',
            description: 'A wonderful test tour experience',
            location: 'Marrakech',
            price: 100,
            duration: 3,
            maxParticipants: 10,
            category: 'cultural',
            agency: agency._id,
            startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            isActive: true
        });

        booking = await Booking.create({
            tour: tour._id,
            user: user._id,
            bookingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            numberOfParticipants: 2,
            totalPrice: 200,
            status: 'pending',
            paymentStatus: 'pending'
        });
    });

    describe('GET /api/payments/methods', () => {
        it('should get available payment methods', async () => {
            const res = await request(app)
                .get('/api/payments/methods');

            expect(res.status).to.equal(200);
            expect(res.body.success).to.be.true;
            expect(res.body.paymentMethods).to.be.an('array');
            expect(res.body.paymentMethods.length).to.be.greaterThan(0);
        });
    });

    describe('POST /api/payments/fiat/initiate', () => {
        it('should initiate fiat payment', async () => {
            const res = await request(app)
                .post('/api/payments/fiat/initiate')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    bookingId: booking._id,
                    paymentGateway: 'stripe',
                    amount: 200,
                    currency: 'USD'
                });

            expect(res.status).to.equal(200);
            expect(res.body.success).to.be.true;
            expect(res.body.paymentIntent).to.have.property('amount', 200);
        });

        it('should reject initiation for already paid booking', async () => {
            booking.paymentStatus = 'paid';
            await booking.save();

            const res = await request(app)
                .post('/api/payments/fiat/initiate')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    bookingId: booking._id,
                    paymentGateway: 'stripe'
                });

            expect(res.status).to.equal(400);
        });
    });

    describe('POST /api/payments/fiat/confirm', () => {
        it('should confirm fiat payment', async () => {
            const res = await request(app)
                .post('/api/payments/fiat/confirm')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    bookingId: booking._id,
                    transactionId: 'TXN123456789',
                    paymentGateway: 'stripe',
                    cardLast4: '4242'
                });

            expect(res.status).to.equal(200);
            expect(res.body.success).to.be.true;
            expect(res.body.booking.paymentStatus).to.equal('paid');
            expect(res.body.booking.status).to.equal('confirmed');
        });

        it('should reject confirmation by non-owner', async () => {
            const otherUser = await User.create({
                email: 'other@test.com',
                password: 'User@123',
                fullName: 'Other User',
                role: 'user'
            });

            const otherLoginRes = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'other@test.com',
                    password: 'User@123'
                });

            const res = await request(app)
                .post('/api/payments/fiat/confirm')
                .set('Authorization', `Bearer ${otherLoginRes.body.token}`)
                .send({
                    bookingId: booking._id,
                    transactionId: 'TXN123456789',
                    paymentGateway: 'stripe'
                });

            expect(res.status).to.equal(403);
        });
    });

    describe('GET /api/payments/history', () => {
        beforeEach(async () => {
            booking.paymentStatus = 'paid';
            booking.paymentMethod = 'fiat';
            booking.fiatPayment = {
                transactionId: 'TXN123',
                paymentGateway: 'stripe',
                paymentDate: new Date()
            };
            await booking.save();
        });

        it('should get payment history', async () => {
            const res = await request(app)
                .get('/api/payments/history')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).to.equal(200);
            expect(res.body.success).to.be.true;
            expect(res.body.payments).to.be.an('array').with.lengthOf(1);
        });
    });
});
