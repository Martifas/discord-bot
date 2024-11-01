import { parse, parseId, parseInsertable, parseSprintCode } from '../schema'
import { fakeMessage } from './utils'

describe('parses record', () => {
  it('parses a valid record', () => {
    const record = fakeMessage()
    expect(parse(record)).toEqual(record)
  })

  it('throws an error due to empty/missing sprintcode', () => {
    const messageWithoutSprintCode = {
      messageId: 11,
      sprintCode: '',
      message: 'Test',
      username: 'testauskas',
    }
    expect(() => parse(messageWithoutSprintCode)).toThrow(/too short/i)
  })
})

describe('parseInsertable', () => {
  it('should omit messageId and message', () => {
    const parsed = parseInsertable(fakeMessage())

    expect(parsed).not.toHaveProperty('messageId')
    expect(parsed).not.toHaveProperty('message')
  })
  it('should not omit sprintCode and username', () => {
    const parsed = parseInsertable(fakeMessage())

    expect(parsed).toHaveProperty('sprintCode')
    expect(parsed).toHaveProperty('username')
  })
})

describe('parseId', () => {
  it('should accept correct format messageId', () => {
    const validId = 1

    expect(parseId(validId)).toBe(validId)
  })
  it('should not  accept wrong format messageId', () => {
    const invalidId = -1

    expect(() => parseId(invalidId)).toThrow(/must be greater than 0/i)
  })
})
describe('parse sprintCode', () => {
  it('should accept correct format sprintCode', () => {
    const validSprintCode = 'WD-1.1'

    expect(parseSprintCode(validSprintCode)).toBe(validSprintCode)
  })
  it('should not  accept wrong shorter sprintCode', () => {
    const invalidSprintCode = 'WD-1.'

    expect(() => parseSprintCode(invalidSprintCode)).toThrow(/Too short/i)
  })
})
describe('parse username', () => {
  it('should accept correct format username', () => {
    const validSprintCode = 'testukas'

    expect(parseSprintCode(validSprintCode)).toBe(validSprintCode)
  })
  it('should not  accept wrong format username', () => {
    const invalidSprintCode = 1

    expect(() => parseSprintCode(invalidSprintCode)).toThrow(
      /Expected string, received number/i
    )
  })
})
