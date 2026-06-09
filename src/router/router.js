import { Router } from 'express'
import routerLogin from './login.router.js'
import routerProducts from './products.router.js'
import routerUsers from './users.router.js'
import jwt from 'jsonwebtoken'
import { getAllUsers, getAllProducts } from '../model/db.js'

const router = Router()

router.use(routerLogin)


router.get('/', async (req, res) => {
  const authHash = req.query.token

  if (!authHash) {
    return res.render('index', { redirect: '/login', error: '', user: null, products: null })
  }

  try {
    const payload = await jwt.verify(authHash, process.env.JWT_SECRET)
    console.log('llegaa')
    const users = await getAllUsers()
    const products = await getAllProducts()
    console.log(users, products)
    res.render('index',  { redirect: '', error: '', users: users, products: [] })
  } catch (error) {
    console.error('Error al verificar en el index:', error)
    res.render('index',  { redirect: '', error: 'Token inválido', user: null, products: null })
  }


})

router.use(routerProducts)
router.use(routerUsers)

export default router
