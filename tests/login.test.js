import { jest } from '@jest/globals'
import express from 'express'
import request from 'supertest'
import jwt from 'jsonwebtoken'

jest.unstable_mockModule('../src/model/db.js', () => ({
  getUserByName: jest.fn(),
  validPassword: jest.fn(),
  updateUser: jest.fn(),
  findUserById: jest.fn()
}))

const db = await import('../src/model/db.js')
const { getUserByName, validPassword } = db
const { default: router } = await import('../src/router/login.router.js')

describe('test /login', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'testsecret'
  })

  beforeEach(() => {
    getUserByName.mockReset()
    validPassword.mockReset()
  })

  it('post redirects to /change-password?token=<token>', async () => {
    const app = express()
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    app.use(router)

    getUserByName.mockResolvedValue({
      user_id: 123,
      user_name: 'admin',
      user_role: 'admin',
      updated_at: null,
      created_at: '2020-01-01',
      user_pass: 'hashedpass'
    })
    validPassword.mockResolvedValue(true)

    const res = await request(app)
      .post('/login')
      .send({ name: 'admin', password: 'adminpass' })

    expect(res.status).toBe(200)
    expect(typeof res.body.redirect).toBe('string')

    const url = new URL(res.body.redirect, 'http://localhost')
    const token = url.searchParams.get('token')
    expect(token).toBeTruthy()
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    expect(payload).toMatchObject({ id: 123, action: 'change-password' })
  })

  it('post returns login object with redirect /index?token=<token> and valid jwt', async () => {
    const app = express()
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    app.use(router)

    getUserByName.mockResolvedValue({
      user_id: 123,
      user_name: 'admin',
      user_role: 'user',
      updated_at: '2021-01-01',
      created_at: '2020-01-01',
      user_pass: 'hashedpass'
    })
    validPassword.mockResolvedValue(true)

    const res = await request(app)
      .post('/login')
      .send({ name: 'admin', password: 'adminpass' })

    expect(res.status).toBe(200)
    expect(typeof res.body.redirect).toBe('string')

    const url = new URL(res.body.redirect, 'http://localhost')
    const token = url.searchParams.get('token')
    expect(token).toBeTruthy()
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    expect(payload).toMatchObject({ id: 123, name: 'admin' })
  })

  it('post returns 401 when credentials are wrong', async () => {
    const app = express()
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    app.use(router)

    getUserByName.mockResolvedValue(undefined)

    validPassword.mockResolvedValue(false)

    const res = await request(app)
      .post('/login')
      .send({ name: 'unknown', password: 'bad' })

    expect(res.status).toBe(401)
    expect(res.body).toHaveProperty('error')
    expect(res.body.error).toBe('Credenciales incorrectas')
  })
})
