const request = require('supertest');
// express app
const app = require('./index');

// db setup
const { sequelize, Dog } = require('./db');
const seed = require('./db/seedFn');
const {dogs} = require('./db/seedData');

describe('Endpoints', () => {
    // to be used in POST test
    const testDogData = {
        breed: 'Poodle',
        name: 'Sasha',
        color: 'black',
        description: 'Sasha is a beautiful black pooodle mix.  She is a great companion for her family.'
    };

    beforeAll(async () => {
        // rebuild db before the test suite runs
        await seed();
    });

    describe('GET /dogs', () => {
        it('should return list of dogs with correct data', async () => {
            // make a request
            const response = await request(app).get('/dogs');
            // assert a response code
            expect(response.status).toBe(200);
            // expect a response
            expect(response.body).toBeDefined();
            // toEqual checks deep equality in objects
            expect(response.body[0]).toEqual(expect.objectContaining(dogs[0]));
        });
    });
});

describe('POST /dogs', () => {
    it('should create a dog in the database with the entered data', async () => {
        const testDogData = {
            breed: 'Poodle',
            name: 'Sasha',
            color: 'black',
            description: 'Sasha is a beautiful black pooodle mix.  She is a great companion for her family.'
        };
        const response = await request(app).post('/dogs').send(testDogData);
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body).toEqual(expect.objectContaining(testDogData));
    });
    it('Assert that the dog data from the DB matches the request body', async () => {
           const testDogData = {
        breed: 'Poodle',
        name: 'Sasha',
        color: 'black',
        description: 'Sasha is a beautiful black pooodle mix.  She is a great companion for her family.'
    };
        const response = await request(app).post('/dogs').send(testDogData);
        
        const dog = response.body;
        const datab_Dog = await Dog.findOne({where: testDogData});
        expect(dog.name).toBe(datab_Dog.name);
        expect(dog.breed).toBe(datab_Dog.breed);
        expect(dog.color).toBe(datab_Dog.color);
        expect(dog.description).toBe(datab_Dog.description);
    });
});

describe('DELETE /dogs', () => {
    it('should delete a dog by id', async () => {
        
        const response = await request(app).delete('/dogs/1');
        
        expect(response.status).toBe(200);
        
        expect(response.text).toEqual('deleted dog with id 1');
    });
    it('Assert that the dog data is null', async () => {
        const response = await request(app).delete('/dogs/1');
        
        const datab_Dog = await Dog.findByPk(1);
        expect(datab_Dog).toBeNull();
    });
});