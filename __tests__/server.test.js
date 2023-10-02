const { db } = require('../server/connection.js')
const app = require('../server/app')
const request = require('supertest')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data')

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

describe('GET /api/articles/:article_id',()=>{
    test('should return a 200 status code when given a valid id',()=>{
        return request(app)
        .get('/api/articles/4')
        .expect(200)
    })
    test('should return the requested article',()=>{
        return request(app)
        .get('/api/articles/4')
        .expect(200)
        .then(({body})=>{
            expect(body.article).toMatchObject({
                    title: "Student SUES Mitch!",
                    topic: "mitch",
                    author: "rogersop",
                    body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
                    created_at: '2020-05-06T01:14:00.000Z',
                    article_img_url:"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
            })
        })
    })
    test('should return a 404 with the message article doesn\'t exist if given an id that does not exist in the database',()=>{
        return request(app)
        .get('/api/articles/999')
        .expect(404)
        .then(({body})=>{
            expect(body.message).toBe("Article doesn't exist")
        })
    })
    test('should return a 400 message Invalid id if given an invalid id',()=>{
        return request(app)
        .get('/api/articles/notAnId')
        .expect(400)
        .then(({body})=> {
            expect(body.message).toBe("Invalid id")
        })
    })
})
