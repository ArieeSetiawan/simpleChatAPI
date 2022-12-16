const app = require ('../index');
const request = require('supertest');
const { User } = require('../models');
const { chat } = require('../models');
const { room } = require('../models')
const jwt = require('jsonwebtoken');
require('dotenv').config()
const server = require('../index')

const testUser={
    name: process.env.TESTUSERNAME,
    email: process.env.TESTUSEREMAIL,
    password: process.env.TESTUSERPASSWORD,
    phone: 12345
}

let validToken = '';
let invalidToken = 'Invalid-token';
let tokenExample= process.env.TOKENREAL;

afterAll(() => {
    server.close()
});

describe('User End Point',()=>{
    it('Register with valid values, response should be 201', async () => {
        const res = await request(app)
          .post('/users/register')
          .send(testUser)
          .set('Accept', 'application/json');
    
        expect(res.status).toBe(201);
    })

    it('Register with invalid values, response should be 422', async () => {
        const res = await request(app)
          .post('/users/register')
          .send({
            name: 'e1ec',
            email: '131213',
            password: 'adsads',
            phone: 8000
          })
          .set('Accept', 'application/json');
    
        expect(res.status).toBe(422);
    })

    it('Register with registered email, response should be 400', async () => {
        const res = await request(app)
          .post('/users/register')
          .send({
            name: 'Elektro',
            email: 'Eddie123@mail.com',
            password: 'Adsads1234',
            phone: 808
          })
          .set('Accept', 'application/json');
    
        expect(res.status).toBe(400);
    })

    it('POST /users/login with valid email and pass, response should be 200', async () => {
        const res = await request(app)
          .post('/users/login')
          .set('Accept', 'application/json')
          .send({
            email: testUser.email,
            password: testUser.password
          });
        expect(res.status).toBe(200);
        console.log(res.body.token,"<<<TOKEN")
        validToken = res.body.token;
      })

    it('Login with wrong password, response should be 401', async () => {
        const res = await request(app)
          .post('/users/login')
          .send({
            email: process.env.TESTUSEREMAIL,
            password: "Test12",
          })
          .set('Accept', 'application/json');
          
        expect(res.status).toBe(401);
    })

    it('Login with wrong email, response should be 401', async () => {
        const res = await request(app)
          .post('/users/login')
          .send({
            email: 'emailkacao@mail.com',
            password: "Test12",
          })
          .set('Accept', 'application/json');
          
        expect(res.status).toBe(401);
    })

    it('Get all user, response should be 200', async () => {
        const res = await request(app)
          .get('/users/')
          .set('Accept', 'application/json');
          
        expect(res.status).toBe(200);
    })

    it('Get user by ID, response should be 200', async () => {
        const user = jwt.verify(validToken,process.env.SECRET_KEY)
        const parameter = user.id
        const res = await request(app)
          .get('/users/get/'+ parameter)
          .set('Accept', 'application/json');
          
        expect(res.status).toBe(200);
    })

    it('Get user by ID, response should be 404', async () => {
        const parameter = '46db0817-42d6-40aa-b71a-7c03dd5939b7'
        const res = await request(app)
          .get('/users/get/'+ parameter)
          .set('Accept', 'application/json');
          
        expect(res.status).toBe(404);
    })

    it('Edit user by ID, response should be 200', async () => {
        const user = jwt.verify(validToken,process.env.SECRET_KEY)
        const parameter = user.id
        const res = await request(app)
          .put('/users/edit/'+ parameter)
          .set('Accept', 'application/json')
          .send({
            name: "Ganti"
          })
          
        expect(res.status).toBe(200);
    })

    it('Edit user by ID, response should be 200', async () => {
        const user = jwt.verify(validToken,process.env.SECRET_KEY)
        const parameter = user.id
        const res = await request(app)
          .put('/users/edit/'+ parameter)
          .set('Accept', 'application/json')
          .send({
            name: "Ganti"
          })
          
        expect(res.status).toBe(200);
    })

    it('Get all contact, response should be 200', async () => {
        const res = await request(app)
          .get('/users/contact/')
          .set('Accept', 'application/json')
          .set('authorization', validToken)
          
        expect(res.status).toBe(200);
    })

    it('Add Friend, response should be 201', async () => {
        const res = await request(app)
          .post('/users/addfriend/')
          .set('Accept', 'application/json')
          .set('authorization', validToken)
          .send({
            destinationId: "06357bb2-da16-40a7-bf72-f11a41f45b32"
          })

        expect(res.status).toBe(201);
    })

    it('Add Friend, already your friend', async () => {
        const res = await request(app)
          .post('/users/addfriend/')
          .set('Accept', 'application/json')
          .set('authorization', tokenExample)
          .send({
            destinationId: "06357bb2-da16-40a7-bf72-f11a41f45b32"
          })

        expect(res.status).toBe(400);
    })
    
    it('Get All Room', async () => {
        const res = await request(app)
          .get('/chats/get/')
          .set('Accept', 'application/json')
          .set('authorization', tokenExample)

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
    })

    it('Create Chat', async () => {
        const res = await request(app)
          .post('/chats/createChat/')
          .set('Accept', 'application/json')
          .set('authorization', tokenExample)
          .send({
            userDestinationId: "886f55d1-8d42-4354-b1a2-72ba3059714f",
            message: "this is test message"
          })
        expect(res.status).toBe(200);
    })

    it('Create Chat with empty message output 403', async () => {
      const res = await request(app)
        .post('/chats/createChat/')
        .set('Accept', 'application/json')
        .set('authorization', tokenExample)
        .send({
          userDestinationId: "886f55d1-8d42-4354-b1a2-72ba3059714f",
          message: ""
        })
      expect(res.status).toBe(403);
  })

  it('Get Room Detail output is 200', async () => {
    const parameter = "05593d99-31b2-453f-beaa-33186c60ff40"
    const res = await request(app)
      .get('/chats/getDetail/'+ parameter)
      .set('Accept', 'application/json')
      .set('authorization', tokenExample)
    expect(res.status).toBe(200);
})

it('Get Room Detail invalid output is 500', async () => {
  const parameter = "05593d99-31b2-453f-beaa-33186c60ff41"
  const res = await request(app)
    .get('/chats/getDetail/'+ parameter)
    .set('Accept', 'application/json')
    .set('authorization', tokenExample)
  expect(res.status).toBe(500);
})

it('No Authorization 401', async () => {
  const parameter = "05917713-6c89-4e41-b9b6-ea7a06bff7cc"
  const res = await request(app)
    .get('/chats/getDetail/'+ parameter)
    .set('Accept', 'application/json')
  expect(res.status).toBe(401);
})

    it('Delete user by ID, response should be 200', async () => {
        const user = jwt.verify(validToken,process.env.SECRET_KEY)
        const parameter = user.id
        const res = await request(app)
          .delete('/users/delete/'+ parameter)
          .set('Accept', 'application/json')

        expect(res.status).toBe(200);
    })

})