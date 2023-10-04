const { db } = require('../server/connection.js')
const app = require('../server/app')
const request = require('supertest')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data')
const endpoints = require('../endpoints.json')
const {convertTimestampToDate} = require('../db/seeds/utils.js')

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
    test('should return a 400 message Bad request if given an invalid id',()=>{
        return request(app)
        .get('/api/articles/notAnId')
        .expect(400)
        .then(({body})=> {
            expect(body.message).toBe("Bad request")
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
    test('should accept a query of topic that will filter the results to only the chosen topic',()=>{
        return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then(({body})=>{
            body.articles.forEach((article)=>{
                expect(article.topic).toBe('mitch')
            })
        })
    })
    test('should return a 200 with an empty array if given a valid topic with no articles',()=>{
        return request(app)
        .get('/api/articles?topic=paper')
        .expect(200)
        .then(({body})=>{
            expect(body.articles).toHaveLength(0)
        })
    })
    test('should return a 404 Topic not found if the topic does not exist',()=>{
        return request(app)
        .get('/api/articles?topic=notATopic')
        .expect(404)
        .then(({body})=>{
            expect(body.message).toBe('Topic not found')
        })
    })
})

describe('POST /api/articles/:article_id/comments',()=>{
    test('should return a 201 status code with the posted comment',()=>{
        return request(app)
        .post('/api/articles/12/comments')
        .send({username:'rogersop',body:'life changing'})
        .expect(201)
        .then(({body}) => {
            const comment = body.comment
            expect(typeof comment.comment_id).toBe('number')
            expect(typeof comment.votes).toBe('number')
            expect(typeof comment.created_at).toBe('string')
            expect(typeof comment.author).toBe('string')
            expect(typeof comment.body).toBe('string')
            expect(typeof comment.article_id).toBe('number')
        })
    })
    test('should return a 404  User not found if passed a username that does not exist in the users database',()=>{
        return request(app)
        .post('/api/articles/12/comments')
        .send({username:'notAUser',body:'life changing'})
        .expect(404).then(({body})=>{
            expect(body.message).toBe('User not found')
        })
    })
    test('should return a 404 Article doesn\'t exist if passed a valid id that does not appear in the database',()=>{
        return request(app)
        .post('/api/articles/999/comments')
        .send({username:'rogersop',body:'life changing'})
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
    test('should return a 400 message Bad request if given an invalid id',()=>{
        return request(app)
        .get('/api/articles/notAnId/comments')
        .expect(400)
        .then(({body})=> {
            expect(body.message).toBe("Bad request")
        })
    })
    test('should return a 200 and an empty array if the article exists but does not have any comments',()=>{
        return request(app)
        .get('/api/articles/10/comments')
        .expect(200)
        .then(({body})=> {
            expect(body.comments).toHaveLength(0)
        })
    })
    test('should return most recent comments first',()=>{
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body})=>{
            expect(body.comments).toBeSortedBy('created_at',{descending:true})
        })
    })
    test('should return a 400 Bad request if given an invalid ID',()=>{
        return request(app)
        .post('/api/articles/notAnID/comments')
        .send({username:'rogersop',body:'life changing'})
        .expect(400).then(({body})=>{
            expect(body.message).toBe("Bad request")
        })
    })
    test('should return a 400 bad request if the body field is missing',()=>{
        return request(app)
        .post('/api/articles/12/comments')
        .send({username:'rogersop'})
        .expect(400).then(({body})=>{
            expect(body.message).toBe("Bad request")
        })
    })
    test('should ignore any additional properties on the body object',()=>{
        return request(app)
        .post('/api/articles/11/comments')
        .send({username:'rogersop',body:'life changing',notImportant:'hello',test:100,votes:1})
        .expect(201)
        .then(({body}) => {
            const comment = body.comment
            expect(comment).toMatchObject({
                comment_id : 21,
                votes : 0,
                created_at: convertTimestampToDate(Date.now()),
                author : 'rogersop',
                body : 'life changing',
                article_id: 11
            })
        })
    })
})

describe('PATCH /api/articles/:article_id',()=>{
    test('should return 200 status with the updated article',()=>{
        return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes : 10 })
        .expect(200)
        .then(({body})=>{
            expect(body.article).toMatchObject({
                article_id: 1,
                title: 'Living in the shadow of a great man',
                topic:'mitch',
                created_at:'2020-07-09T20:11:00.000Z',
                votes:110,
                article_img_url:'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
            })
        })
    })
    test('should return a 404 Article doesn\'t exist if a valid but not existing id is provided',()=>{
        return request(app)
        .patch('/api/articles/999')
        .send({ inc_votes : 10 })
        .expect(404).then(({body})=>{
            expect(body.message).toBe("Article doesn't exist")
        })
    })
    test('should return a 400 Bad request if given an invalid ID',()=>{
        return request(app)
        .patch('/api/articles/notAnID')
        .send({ inc_votes : 10 })
        .expect(400).then(({body})=>{
            expect(body.message).toBe("Bad request")
        })
    })
    test('should return a reduced vote count if passed a negative number',()=>{
        return request(app)
        .patch('/api/articles/2')
        .send({ inc_votes : -30 })
        .expect(200)
        .then(({body})=>{
            expect(body.article).toMatchObject({
                article_id: 2,
                title: 'Sony Vaio; or, The Laptop',
                topic:'mitch',
                created_at:'2020-10-16T05:03:00.000Z',
                votes:-30,
                article_img_url:'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
            })
        })
    })
    test('should ignore additional properties on the body object',()=>{
        return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes : 10, not_important:'nothing', test: 100})
        .expect(200).then(({body})=>{
            expect(body.article).toMatchObject({
                article_id: 1,
                title: 'Living in the shadow of a great man',
                topic:'mitch',
                created_at:'2020-07-09T20:11:00.000Z',
                votes:120,
                article_img_url:'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
            })
        })
    })
    test('should return a 400 bad request if body is missing inc_votes key',()=>{
        return request(app)
        .patch('/api/articles/1')
        .send({ inc_vote : 1, not_important:'nothing', test: 100})
        .expect(400).then(({body})=>{
            expect(body.message).toBe('Bad request')
        })
    })
    test('should return a 400 bad request if inc_votes is invalid data type',()=>{
        return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes : 'hello', not_important:'nothing', test: 100})
        .expect(400).then(({body})=>{
            expect(body.message).toBe('Bad request')
        })
    })
})

describe('DELETE /api/comments/:comment_id',()=>{
    test('should return a 204 with no content',()=>{
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
    })
    test('should delete the comment at the id',()=>{
        return request(app)
        .delete('/api/comments/3')
        .expect(204).then(({body})=>{
            return db.query(`
                SELECT * FROM comments
                WHERE comment_id = 3;            
            `)
        }).then((result)=>{
            expect(result.rows).toHaveLength(0)
        })
    })
    test('should return a 400 Bad request if given an invalid id',()=>{
        return request(app)
        .delete('/api/comments/notAnId')
        .expect(400).then(({body})=>{
            expect(body.message).toBe('Bad request')
        })
    })
    test('should return 404 Comment not found if given a valid id that doesn\'t exist in the database',()=>{
        return request(app)
        .delete('/api/comments/999')
        .expect(404).then(({body})=>{
            expect(body.message).toBe('Comment doesn\'t exist')
        })
    })
})

describe('GET /api/users',()=>{
    test('should return a 200 status and an array of all user objects',()=>{
        return request(app)
        .get('/api/users')
        .expect(200).then(({body})=>{
            expect(body.users).toHaveLength(4)
            body.users.forEach((user)=>{
                expect(typeof user.username).toBe('string')
                expect(typeof user.name).toBe('string')
                expect(typeof user.avatar_url).toBe('string')
            })
        })
    })
})