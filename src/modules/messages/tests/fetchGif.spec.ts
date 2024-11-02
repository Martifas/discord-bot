import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GiphyFetch } from '@giphy/js-fetch-api'
import fetchGif from '../messageCompiler/fetchGif'

vi.mock('@giphy/js-fetch-api', () => ({
  GiphyFetch: vi.fn(),
}))

vi.mock('dotenv/config', () => ({
  default: {},
}))

describe('Giphy Fetcher', () => {
  const originalConsoleError = console.error

  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
    process.env.GIPHY_API = undefined
    console.error = vi.fn()
    ;(GiphyFetch as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      () => ({
        random: vi.fn(),
      })
    )
  })

  afterEach(() => {
    console.error = originalConsoleError
  })

  it('should successfully fetch a random gif', async () => {
    process.env.GIPHY_API = 'fake-api-key'
    const mockGif = {
      id: '123',
      title: 'Test GIF',
      url: 'https://giphy.com/test',
    }
    const mockRandom = vi.fn().mockResolvedValue({ data: mockGif })
    ;(GiphyFetch as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      () => ({
        random: mockRandom,
      })
    )

    const result = await fetchGif()

    expect(GiphyFetch).toHaveBeenCalledWith('fake-api-key')
    expect(mockRandom).toHaveBeenCalledWith({
      tag: 'congratulations',
      type: 'gifs',
      rating: 'g',
      offset: expect.any(Number),
    })
    expect(result).toEqual(mockGif)
  })

  it('should throw error when GIPHY_API key is missing', async () => {
    delete process.env.GIPHY_API
    await expect(fetchGif()).rejects.toThrow(
      'GIPHY_API key is required in environment variables'
    )
    expect(GiphyFetch).not.toHaveBeenCalled()
  })

  it('should throw error when Giphy API call fails', async () => {
    process.env.GIPHY_API = 'fake-api-key'
    const mockError = new Error('API Error')
    const mockRandom = vi.fn().mockRejectedValue(mockError)
    ;(GiphyFetch as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      () => ({
        random: mockRandom,
      })
    )
    const consoleErrorSpy = vi.spyOn(console, 'error')
    await expect(fetchGif()).rejects.toThrow('API Error')
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error fetching from Giphy:',
      mockError
    )
  })
})
