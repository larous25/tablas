import { Router } from 'express'
import { createProduct } from '../model/db.js'
import auth from '../middlewares/auth.js'

const routerProducts = Router()

routerProducts.use(auth)

routerProducts.post('/product', async (req, res) => {
  try {
    createProduct(req.body.des, req.body.valor)
    res.status(200).json({ product: res.body })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default routerProducts
