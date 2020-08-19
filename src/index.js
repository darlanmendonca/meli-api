import express from 'express'
import cors from 'cors'
import products from './products/products.router.js'

const PORT = process.env.PORT || 5000
const app = express()

app
  .use(cors())
  .use('/products', products)

app.listen(PORT)
