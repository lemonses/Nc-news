const { db } = require('../server/connection.js')
const app = require('../server/app')
const request = require('supertest')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data')
const endpoints = require('../endpoints.json')

beforeAll(()=>seed(data))
afterAll(()=>db.end())

describe('/api',()=>{
    test('should return a 404 with a message Path not found if an unrecognised endpoint is provided',()=>{
        return request(app)
        .get('/api/notAnEndpoint')
        .expect(404)
        .then(({body})=>{
            expect(body.message).toBe('Path not found')
        })
    })

})

describe('GET /api/topics',()=>{
    test('should return a 200 status code',()=>{
        return request(app)
        .get('/api/topics')
        .expect(200)
    })
    test('should return an array of topic objects',()=>{
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body})=>{
            expect(body.topics).toHaveLength(3)
            body.topics.forEach(topic => {
                expect(topic).toHaveProperty('slug')
                expect(topic).toHaveProperty('description')
            });
        })
    })
})

describe('GET /api',()=>{
    test('should return a 200 status code',()=>{
        return request(app)
        .get('/api')
        .expect(200)
    })
    test('should return a JSON object',()=>{
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body})=>{
            const {response} = body
            expect(typeof response).toBe('string')
            expect(response[0]).toBe('{')
            expect(response[response.length-1]).toBe('}')
        })
    })
    test('should return all available endpoints',()=>{
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body})=>{
            const {response} = body
            console.log(response)
            expect(JSON.parse(response)).toMatchObject(endpoints)
        })
    })
})

