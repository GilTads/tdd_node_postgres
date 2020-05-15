const request = require('supertest')

const app = require('../../src/app')
const factory = require('../factories')
const truncate = require('../utils/truncate')

describe('Authentication', () => {
  beforeEach(async () => {
    await truncate()
  })
  it('should authenticate with valid credentials', async () => {
    const user = await factory.create('User', {
      password: '123132'
    })

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '123132'
      })

    expect(response.status).toBe(200)
  })
  it('should not authenticate with invalid credentials', async () => {
    const user = await factory.create('User', {
      password: '1df15d1f'
    })

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '1sdsd23456'
      })

    expect(response.status).toBe(401)
  })

  it('should return jwt token when authenticated', async () => {
    const user = await factory.create('User')

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '123456'
      })

    expect(response.body).toHaveProperty('token')
  })
})
