// @ts-nocheck
import { describe, it, expect, vi } from 'vitest'
import { TextChannel } from 'discord.js'

vi.mock('../fetchUser')
vi.mock('../../messages/messageCompiler/fetchGif')
vi.mock('..')

import sendMessage from '../sendMessage'
import { getClient } from '..'
import fetchUser from '../fetchUser'
import giphySearch from '../../messages/messageCompiler/fetchGif'

describe('sendMessage', () => {
  const username = 'testUser'
  const message = 'Hello testUser!'
  const mockMember = { id: '12345' }
  const mockGifUrl = 'http://example.com/gif.gif'

  const mockTextChannel = {
    send: vi.fn().mockResolvedValue(undefined),
  }

  Object.setPrototypeOf(mockTextChannel, TextChannel.prototype)

  beforeEach(() => {
    vi.clearAllMocks()

    delete process.env.NODE_ENV
    delete process.env.GENERAL_CHANNEL
  })

  it('should not send a message in test environment', async () => {
    process.env.NODE_ENV = 'test'
    await sendMessage(username, message)
    expect(fetchUser).not.toHaveBeenCalled()
    expect(giphySearch).not.toHaveBeenCalled()
  })

  it('should send a message with a gif when giphy search returns a gif', async () => {
    process.env.NODE_ENV = 'development'
    process.env.GENERAL_CHANNEL = 'general-channel-id'

    vi.mocked(giphySearch).mockResolvedValue({
      images: { original: { url: mockGifUrl } },
    })
    vi.mocked(fetchUser).mockResolvedValue(mockMember)

    const mockClient = {
      channels: {
        fetch: vi.fn().mockResolvedValue(mockTextChannel),
      },
    }
    vi.mocked(getClient).mockReturnValue(mockClient)

    await sendMessage(username, message)

    expect(fetchUser).toHaveBeenCalledWith(username)
    expect(giphySearch).toHaveBeenCalled()
    expect(mockClient.channels.fetch).toHaveBeenCalledWith('general-channel-id')

    expect(mockTextChannel.send).toHaveBeenCalledWith({
      content: 'Hello <@12345>!',
      files: [mockGifUrl],
    })
  })

  it('should send a message without a gif when giphy search returns no gif', async () => {
    process.env.NODE_ENV = 'development'
    process.env.GENERAL_CHANNEL = 'general-channel-id'

    vi.mocked(giphySearch).mockResolvedValue(null)
    vi.mocked(fetchUser).mockResolvedValue(mockMember)

    const mockClient = {
      channels: {
        fetch: vi.fn().mockResolvedValue(mockTextChannel),
      },
    }
    vi.mocked(getClient).mockReturnValue(mockClient)

    await sendMessage(username, message)

    expect(fetchUser).toHaveBeenCalledWith(username)
    expect(giphySearch).toHaveBeenCalled()
    expect(mockClient.channels.fetch).toHaveBeenCalledWith('general-channel-id')
    expect(mockTextChannel.send).toHaveBeenCalledWith('Hello <@12345>!')
  })

  it('should handle errors gracefully', async () => {
    process.env.NODE_ENV = 'development'
    process.env.GENERAL_CHANNEL = 'general-channel-id'

    vi.mocked(fetchUser).mockResolvedValue(null)
    const mockClient = {
      channels: {
        fetch: vi.fn().mockResolvedValue(mockTextChannel),
      },
    }
    vi.mocked(getClient).mockReturnValue(mockClient)

    await sendMessage(username, message)
    expect(mockTextChannel.send).not.toHaveBeenCalled()
  })

  afterEach(() => {
    delete process.env.NODE_ENV
    delete process.env.GENERAL_CHANNEL
  })
})
