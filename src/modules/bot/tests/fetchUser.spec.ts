import { describe, it, expect, vi, beforeEach } from 'vitest'
import fetchUser from '../fetchUser'
import { Client, Collection, Guild, GuildMember } from 'discord.js'

vi.mock('discord.js', () => {
  return {
    Client: vi.fn(),
    Collection: vi.fn(() => ({
      first: vi.fn(),
    })),
  }
})

vi.mock('..', () => ({
  getClient: vi.fn(),
}))

import { getClient } from '..'

describe('fetchUser', () => {
  let mockClient: Client
  let mockGuild: Guild
  let mockMember: GuildMember

  beforeEach(() => {
    vi.clearAllMocks()

    mockMember = {
      id: '123456789',
      user: {
        username: 'testUser',
      },
    } as GuildMember

    const mockSearchResults = {
      first: vi.fn().mockReturnValue(mockMember),
    } as unknown as Collection<string, GuildMember>

    mockGuild = {
      members: {
        search: vi.fn().mockResolvedValue(mockSearchResults),
      },
    } as unknown as Guild

    mockClient = {
      guilds: {
        fetch: vi.fn().mockResolvedValue(mockGuild),
      },
    } as unknown as Client

    const mockGetClient = vi.mocked(getClient)
    mockGetClient.mockReturnValue(mockClient)
  })

  it('should return undefined when client is not available', async () => {
    vi.mocked(getClient).mockReturnValue(null)
    const result = await fetchUser('testUser')
    expect(result).toBeUndefined()
  })

  it('should successfully find a member by username', async () => {
    const result = await fetchUser('testUser')

    expect(getClient).toHaveBeenCalled()
    expect(vi.mocked(mockClient.guilds.fetch)).toHaveBeenCalledWith(
      process.env.GUILD_ID
    )
    expect(vi.mocked(mockGuild.members.search)).toHaveBeenCalledWith({
      query: 'testUser',
      limit: 1,
    })
    expect(result).toBe(mockMember)
  })

  it('should return undefined when no member is found', async () => {
    const mockEmptySearchResults = {
      first: vi.fn().mockReturnValue(undefined),
    } as unknown as Collection<string, GuildMember>

    vi.mocked(mockGuild.members.search).mockResolvedValue(
      mockEmptySearchResults
    )

    const result = await fetchUser('nonexistentUser')
    expect(result).toBeUndefined()
  })

  it('should handle API errors gracefully', async () => {
    vi.mocked(mockGuild.members.search).mockRejectedValue(
      new Error('API Error')
    )
    await expect(fetchUser('testUser')).rejects.toThrow('API Error')
  })
})
