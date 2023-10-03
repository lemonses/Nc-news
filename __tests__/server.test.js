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
    test('should return an array of topic objects with 200 status code',()=>{
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
    test('should return a 404 with the message Article doesn\'t exist if given an id that does not exist in the database',()=>{
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
describe('GET /api',()=>{
    test('should return a JSON object with 200 status',()=>{
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body})=>{
            const parsedResponse = JSON.parse(body.response)
            expect(typeof parsedResponse).toBe('object')
        })
    })
    test('should return all available endpoints',()=>{
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body})=>{
            const {response} = body
            expect(JSON.parse(response)).toMatchObject(endpoints)
        })
    })
})

describe('GET /api/articles',()=>{
    test('should return a status code 200 with an array of articles',()=>{
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body})=>{
            expect(body.articles).toHaveLength(13)
            body.articles.forEach((article)=>{
                expect(article).toHaveProperty('author')
                expect(article).toHaveProperty('title')
                expect(article).toHaveProperty('article_id')
                expect(article).toHaveProperty('topic')
                expect(article).toHaveProperty('created_at')
                expect(article).toHaveProperty('votes')
                expect(article).toHaveProperty('article_img_url')
                expect(article).toHaveProperty('comment_count')
                expect(article).not.toHaveProperty('body')
            })
        })
    })
    test('should return articles in descending date order',()=>{
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body})=>{
            expect(body.articles).toBeSortedBy('created_at',{descending:true})
        })
    })
})

describe('GET /api/articles/:article_id/comments',()=>{
    test('should return a 200 status code with an array of comments',()=>{
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            expect(body.comments).toHaveLength(11)
            body.comments.forEach(comment => {
                expect(typeof comment.comment_id).toBe('number')
                expect(typeof comment.votes).toBe('number')
                expect(typeof comment.created_at).toBe('string')
                expect(typeof comment.author).toBe('string')
                expect(typeof comment.body).toBe('string')
                expect(typeof comment.article_id).toBe('number')
            })
        })
    })
    test('should return a 404 with the message Article doesn\'t exist if given an id that does not exist in the database',()=>{
        return request(app)
        .get('/api/articles/999/comments')
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe("Article doesn't exist")
        })
    })
    test('should return a 400 message Invalid id if given an invalid id',()=>{
        return request(app)
        .get('/api/articles/notAnId/comments')
        .expect(400)
        .then(({body})=> {
            expect(body.message).toBe("Invalid id")
        })
    })
    test('should return a 200 and an empty array if the article exists but does not have any comments',()=>{
        return request(app)
        .get('/api/articles/12/comments')
        .expect(200)
        .then(({body})=> {
            expect(body.comments).toHaveLength(0)
        })
    })
    test('should return most recent comments first',()=>{
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body})=> {
            expect(body.comments).toBeSortedBy('created_at',{descending:true})
        })
    })
})