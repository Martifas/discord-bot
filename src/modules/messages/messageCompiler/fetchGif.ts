import 'dotenv/config'
import { GiphyFetch } from '@giphy/js-fetch-api'

export default async () => {
  const api_key = process.env.GIPHY_API
  if (!api_key) {
    throw new Error('GIPHY_API key is required in environment variables')
  }
  const gf = new GiphyFetch(api_key)
  try {
    const { data: gif } = await gf.random({
      tag: 'congratulations',
      type: 'gifs',
      rating: 'g',
      offset: Math.floor(Math.random() * 100),
    })

    return gif
  } catch (error) {
    console.error('Error fetching from Giphy:', error)
    throw error
  }
}
