import express from 'express'
import { list, single } from './products.controller.js'

const router = express.Router()

router
  .route('/products')
  .get(list)

router
  .route('/products/:id')
  .get(single)

export default router
