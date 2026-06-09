import { Router } from 'express'
import { createProduct } from '../model/db.js'
import auth from '../middlewares/auth.js'

const routerUser = Router()

routerUser.use(auth)

routerUser.post('/users', async (req, res) => {
  try {
    createProduct(req.body.des, req.body.valor)
    res.status(200).json({ product: res.body })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

routerUser.put('/user', async (req, res) => {
  res.status(200).json({ message: 'Usuario actualizado' })
})

export default routerUser
