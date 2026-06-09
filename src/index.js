import express from 'express'
import ejs from 'ejs'
import { fileURLToPath } from 'url'
import path from 'path'

import router from './router/router.js'
import { initDatabase } from './model/db.js'

initDatabase()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Middlewares
app.use(express.static(__dirname + '/public/'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine('ejs', ejs.renderFile)
app.set('views', './src/views')
app.set('view engine', 'ejs')

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
  next()
})

app.use(router)

app.listen(process.env.PORT || 3000, () =>
  console.log('Servidor en puerto 3000')
)
