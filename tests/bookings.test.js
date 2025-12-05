import request from 'supertest';
import { expect } from 'chai';
import app from '../server.js';
import User from '../models/User.js';
import Tour from '../models/Tour.js';
import Booking from '../models/Booking.js';
import connectDB from '../config/database.js';

describe('Bookings API', () => {
    let server;
    let userToken;
    let user;
    let tour;

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

        // Create agency
        const agency = await User.create({
            email: 'agency@test.com',
            password: 'Agency@123',
            fullName: 'Test Agency',
            role: 'agency'
        });

        // Create user
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

        // Create tour
        tour = await Tour.create({
            name: 'Test Tour',
            description: 'A wonderful test tour with amazing experiences',
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
    });

    describe('POST /api/bookings', () => {
        it('should create a booking', async () => {
            const res = await request(app)
                .post('/api/bookings')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    tourId: tour._id,
                    bookingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    numberOfParticipants: 2
                });

            expect(res.status).to.equal(201);
            expect(res.body.success).to.be.true;
            expect(res.body.booking).to.have.property('totalPrice', 200);
        });

        it('should reject booking without authentication', async () => {
            const res = await request(app)
                .post('/api/bookings')
                .send({
                    tourId: tour._id,
                    bookingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    numberOfParticipants: 2
                });

            expect(res.status).to.equal(401);
        });

        it('should reject booking for inactive tour', async () => {
            tour.isActive = false;
            await tour.save();

            const res = await request(app)
                .post('/api/bookings')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    tourId: tour._id,
                    bookingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    numberOfParticipants: 2
                });

            expect(res.status).to.equal(400);
        });
    });

    describe('GET /api/bookings/my-bookings', () => {
        beforeEach(async () => {
            await Booking.create({
                tour: tour._id,
                user: user._id,
                bookingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                numberOfParticipants: 2,
                totalPrice: 200,
                status: 'confirmed',
                paymentStatus: 'paid'
            });
        });

        it('should get user bookings', async () => {
            const res = await request(app)
                .get('/api/bookings/my-bookings')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).to.equal(200);
            expect(res.body.success).to.be.true;
            expect(res.body.bookings).to.be.an('array').with.lengthOf(1);
        });
    });

    describe('PUT /api/bookings/:id/payment', () => {
        let booking;

        beforeEach(async () => {
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

        it('should update payment status with fiat payment', async () => {
            const res = await request(app)
                .put(`/api/bookings/${booking._id}/payment`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    paymentStatus: 'paid',
                    paymentMethod: 'fiat',
                    fiatPayment: {
                        transactionId: 'TXN123456',
                        paymentGateway: 'stripe',
                        cardLast4: '4242'
                    }
                });

            expect(res.status).to.equal(200);
            expect(res.body.success).to.be.true;
            expect(res.body.booking.paymentStatus).to.equal('paid');
            expect(res.body.booking.status).to.equal('confirmed');
        });

        it('should update payment status with Hedera', async () => {
            const res = await request(app)
                .put(`/api/bookings/${booking._id}/payment`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    paymentStatus: 'paid',
                    paymentMethod: 'hedera',
                    hederaTransactionId: '0.0.123456@1234567890.123'
                });

            expect(res.status).to.equal(200);
            expect(res.body.success).to.be.true;
            expect(res.body.booking.hederaTransactionId).to.exist;
        });
    });

    describe('DELETE /api/bookings/:id', () => {
        let booking;

        beforeEach(async () => {
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

        it('should cancel booking', async () => {
            const res = await request(app)
                .delete(`/api/bookings/${booking._id}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).to.equal(200);
            expect(res.body.success).to.be.true;

            const cancelledBooking = await Booking.findById(booking._id);
            expect(cancelledBooking.status).to.equal('cancelled');
        });
    });
});
