import 'dotenv/config'
import { Router } from 'express'
import handleQuote from './handleQuote'

const router = Router()

const GENERAL_CHANNEL = process.env.GENERAL_CHANNEL
if (!GENERAL_CHANNEL) {
  throw new Error('GENERAL_CHANNEL must be defined in environment variables')
}

router.get('/', async (req, res) => {
  try {
    const quote = await handleQuote()
    res.json({ message: quote })
  } catch (error) {
    console.error('Error fetching quote:', error)
    res.status(500).json({ error: 'Failed to fetch quote' })
  }
})

export default router
