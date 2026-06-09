import { jest } from '@jest/globals'

const mockConn = {
  query: jest.fn(),
  release: jest.fn()
}
mockConn.end = jest.fn()

const mockPool = {
  getConnection: jest.fn(async () => mockConn)
}

jest.unstable_mockModule('mariadb', () => ({
  createConnection: jest.fn(async () => mockConn),
  createPool: jest.fn(() => mockPool)
}))

const db = await import('../src/model/db.js')
const { getUserByName, findUserById } = db

describe('getUserByName', () => {
  beforeEach(() => {
    mockConn.query.mockReset()
    mockConn.release.mockClear()
    mockPool.getConnection.mockClear()
  })

  it('returns the user user when the query matches', async () => {
    mockConn.query.mockResolvedValue([
      { user_id: 1, user_name: 'admin', user_pass: 'hashedpass' }
    ])

    const user = await getUserByName('admin')

    expect(mockPool.getConnection).toHaveBeenCalled()
    expect(mockConn.query).toHaveBeenCalledWith(
      'SELECT * FROM users WHERE user_name = ?',
      ['admin']
    )
    expect(mockConn.release).toHaveBeenCalled()
    expect(user).toEqual({
      user_id: 1,
      user_name: 'admin',
      user_pass: 'hashedpass'
    })
  })

  it('returns undefined when no user is found', async () => {
    mockConn.query.mockResolvedValue([])

    const user = await getUserByName('missing')

    expect(mockPool.getConnection).toHaveBeenCalled()
    expect(mockConn.query).toHaveBeenCalledWith(
      'SELECT * FROM users WHERE user_name = ?',
      ['missing']
    )
    expect(mockConn.release).toHaveBeenCalled()
    expect(user).toBeUndefined()
  })
})

describe('findUserById', () => {
  beforeEach(() => {
    mockConn.query.mockReset()
    mockConn.release.mockClear()
    mockPool.getConnection.mockClear()
  })

  it('returns the user user when the query matches', async () => {
    mockConn.query.mockResolvedValue([
      { user_id: 1, user_name: 'admin', user_pass: 'hashedpass' }
    ])

    const user = await findUserById(1)
    expect(mockPool.getConnection).toHaveBeenCalled()
    expect(mockConn.query).toHaveBeenCalledWith(
      'SELECT * FROM users WHERE user_id = ?',
      [1]
    )
    expect(mockConn.release).toHaveBeenCalled()
    expect(user).toEqual({
      user_id: 1,
      user_name: 'admin',
      user_pass: 'hashedpass'
    })
  })

  it('returns undefined when no user is found', async () => {
    mockConn.query.mockResolvedValue([])

    const user = await findUserById(1)
    expect(mockPool.getConnection).toHaveBeenCalled()
    expect(mockConn.query).toHaveBeenCalledWith(
      'SELECT * FROM users WHERE user_id = ?',
      [1]
    )
    expect(mockConn.release).toHaveBeenCalled()
    expect(user).toBeUndefined()
  })
})
