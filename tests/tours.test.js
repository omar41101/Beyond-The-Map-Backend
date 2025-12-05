import request from 'supertest';
import { expect } from 'chai';
import app from '../server.js';
import User from '../models/User.js';
import Tour from '../models/Tour.js';
import connectDB from '../config/database.js';

describe('Tours API', () => {
    let server;
    let agencyToken;
    let agencyUser;
    let userToken;

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

        // Create agency user
        agencyUser = await User.create({
            email: 'agency@test.com',
            password: 'Agency@123',
            fullName: 'Test Agency',
            role: 'agency'
        });

        const agencyLogin = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'agency@test.com',
                password: 'Agency@123'
            });

        agencyToken = agencyLogin.body.token;

        // Create regular user
        await User.create({
            email: 'user@test.com',
            password: 'User@123',
            fullName: 'Test User',
            role: 'user'
        });

        const userLogin = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'user@test.com',
                password: 'User@123'
            });

        userToken = userLogin.body.token;
    });

    describe('POST /api/tours', () => {
        it('should create a tour as agency', async () => {
            const res = await request(app)
                .post('/api/tours')
                .set('Authorization', `Bearer ${agencyToken}`)
                .send({
                    name: 'Test Tour',
                    description: 'A wonderful tour experience in Morocco with authentic culture',
                    location: 'Marrakech',
                    price: 99.99,
                    duration: 3,
                    maxParticipants: 10,
                    category: 'cultural',
                    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
                });

            expect(res.status).to.equal(201);
            expect(res.body.success).to.be.true;
            expect(res.body.tour).to.have.property('name', 'Test Tour');
        });

        it('should reject tour creation by regular user', async () => {
            const res = await request(app)
                .post('/api/tours')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    name: 'Test Tour',
                    description: 'A wonderful tour experience',
                    location: 'Marrakech',
                    price: 99.99,
                    duration: 3,
                    maxParticipants: 10,
                    category: 'cultural'
                });

            expect(res.status).to.equal(403);
        });
    });

    describe('GET /api/tours', () => {
        beforeEach(async () => {
            await Tour.create([
                {
                    name: 'Cultural Tour',
                    description: 'Explore Moroccan culture and traditions deeply',
                    location: 'Fez',
                    price: 79.99,
                    duration: 2,
                    maxParticipants: 15,
                    category: 'cultural',
                    agency: agencyUser._id,
                    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    isActive: true
                },
                {
                    name: 'Adventure Tour',
                    description: 'Exciting adventure in the Atlas Mountains',
                    location: 'Atlas Mountains',
                    price: 149.99,
                    duration: 4,
                    maxParticipants: 8,
                    category: 'adventure',
                    agency: agencyUser._id,
                    startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                    isActive: true
                }
            ]);
        });

        it('should get all active tours', async () => {
            const res = await request(app)
                .get('/api/tours');

            expect(res.status).to.equal(200);
            expect(res.body.success).to.be.true;
            expect(res.body.tours).to.be.an('array').with.lengthOf(2);
        });

        it('should filter tours by category', async () => {
            const res = await request(app)
                .get('/api/tours?category=cultural');

            expect(res.status).to.equal(200);
            expect(res.body.tours).to.be.an('array').with.lengthOf(1);
            expect(res.body.tours[0]).to.have.property('category', 'cultural');
        });

        it('should filter tours by price range', async () => {
            const res = await request(app)
                .get('/api/tours?minPrice=100&maxPrice=200');

            expect(res.status).to.equal(200);
            expect(res.body.tours).to.be.an('array').with.lengthOf(1);
            expect(res.body.tours[0].price).to.be.greaterThan(100);
        });

        it('should search tours by name', async () => {
            const res = await request(app)
                .get('/api/tours?search=cultural');

            expect(res.status).to.equal(200);
            expect(res.body.tours).to.be.an('array').with.lengthOf(1);
        });
    });

    describe('GET /api/tours/:id', () => {
        let tour;

        beforeEach(async () => {
            tour = await Tour.create({
                name: 'Test Tour',
                description: 'A wonderful test tour experience',
                location: 'Marrakech',
                price: 99.99,
                duration: 3,
                maxParticipants: 10,
                category: 'cultural',
                agency: agencyUser._id,
                startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                isActive: true
            });
        });

        it('should get tour by id', async () => {
            const res = await request(app)
                .get(`/api/tours/${tour._id}`);

            expect(res.status).to.equal(200);
            expect(res.body.success).to.be.true;
            expect(res.body.tour).to.have.property('name', 'Test Tour');
        });

        it('should return 404 for non-existent tour', async () => {
            const fakeId = '507f1f77bcf86cd799439011';
            const res = await request(app)
                .get(`/api/tours/${fakeId}`);

            expect(res.status).to.equal(404);
        });
    });

    describe('PUT /api/tours/:id', () => {
        let tour;

        beforeEach(async () => {
            tour = await Tour.create({
                name: 'Original Tour',
                description: 'Original description for the tour',
                location: 'Marrakech',
                price: 99.99,
                duration: 3,
                maxParticipants: 10,
                category: 'cultural',
                agency: agencyUser._id,
                startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                isActive: true
            });
        });

        it('should update tour as owner', async () => {
            const res = await request(app)
                .put(`/api/tours/${tour._id}`)
                .set('Authorization', `Bearer ${agencyToken}`)
                .send({
                    name: 'Updated Tour',
                    price: 129.99
                });

            expect(res.status).to.equal(200);
            expect(res.body.success).to.be.true;
            expect(res.body.tour).to.have.property('name', 'Updated Tour');
            expect(res.body.tour).to.have.property('price', 129.99);
        });

        it('should reject update by non-owner', async () => {
            const res = await request(app)
                .put(`/api/tours/${tour._id}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    name: 'Hacked Tour'
                });

            expect(res.status).to.equal(403);
        });
    });

    describe('DELETE /api/tours/:id', () => {
        let tour;

        beforeEach(async () => {
            tour = await Tour.create({
                name: 'Tour to Delete',
                description: 'This tour will be deleted in the test',
                location: 'Marrakech',
                price: 99.99,
                duration: 3,
                maxParticipants: 10,
                category: 'cultural',
                agency: agencyUser._id,
                startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                isActive: true
            });
        });

        it('should soft delete tour as owner', async () => {
            const res = await request(app)
                .delete(`/api/tours/${tour._id}`)
                .set('Authorization', `Bearer ${agencyToken}`);

            expect(res.status).to.equal(200);
            expect(res.body.success).to.be.true;

            const deletedTour = await Tour.findById(tour._id);
            expect(deletedTour.isActive).to.be.false;
        });
    });

    describe('GET /api/tours/stats', () => {
        beforeEach(async () => {
            await Tour.create([
                {
                    name: 'Tour 1',
                    description: 'First tour for statistics testing',
                    location: 'Fez',
                    price: 79.99,
                    duration: 2,
                    maxParticipants: 15,
                    category: 'cultural',
                    agency: agencyUser._id,
                    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    tourStatus: 'upcoming',
                    isActive: true
                },
                {
                    name: 'Tour 2',
                    description: 'Second tour for statistics testing',
                    location: 'Marrakech',
                    price: 99.99,
                    duration: 3,
                    maxParticipants: 10,
                    category: 'adventure',
                    agency: agencyUser._id,
                    startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                    endDate: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000),
                    tourStatus: 'upcoming',
                    isActive: true
                }
            ]);
        });

        it('should get tour statistics', async () => {
            const res = await request(app)
                .get('/api/tours/stats');

            expect(res.status).to.equal(200);
            expect(res.body.success).to.be.true;
            expect(res.body.stats).to.be.an('array');
        });
    });
});
