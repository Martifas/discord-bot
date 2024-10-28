import { Database } from '@/database'
import { Router } from 'express'
import type { Request, Response } from 'express'

export default (db: Database) => {
  const router = Router()

  router.post('/', (req: Request, res: Response) => {})

  router.get('/', (req, res) => {})

  router.patch('/', (req, res) => {})

  router.delete('/', (req, res) => {})
}
