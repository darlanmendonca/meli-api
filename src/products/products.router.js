import express from 'express'
import { list, single } from './products.controller.js'

const router = express.Router()

router
  .route('/')
  .get(list)

router
  .route('/:id')
  .get(single)

export default router
