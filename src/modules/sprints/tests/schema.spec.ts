import {
  parse,
  parseId,
  parseInsertable,
  parseSprintCode,
  parseUpdatable,
} from '../schema'
import { fakeSprintFull } from './utils'

it('parses a valid record', () => {
  const record = fakeSprintFull()
  expect(parse(record)).toEqual(record)
})

it('throws an error due to empty/missing title', () => {
  const sprintWithoutTitle = {
    id: 11,
    title: '',
    sprintCode: 'WD-7.7',
  }
  expect(() => parse(sprintWithoutTitle)).toThrow(/title/i)
})
it('throws an error due to empty/missing sprintcode', () => {
  const sprintWithoutCode = {
    id: 11,
    title: 'Advanced Course',
    sprintCode: '',
  }
  expect(() => parse(sprintWithoutCode)).toThrow(/sprintcode/i)
})

describe('parseInsertable', () => {
  it('omits id', () => {
    const parsed = parseInsertable(fakeSprintFull())

    expect(parsed).not.toHaveProperty('id')
  })
})

describe('parseUpdatable', () => {
  it('omits id', () => {
    const parsed = parseUpdatable(fakeSprintFull())

    expect(parsed).not.toHaveProperty('id')
  })
})

describe('parseId', () => {
  it('should not accept wrong format Id', () => {
    const sprintWithWrongFormatId = {
      id: -1,
      title: 'Advanced Course',
      sprintCode: 'WD-1.1',
    }

    expect(() => parseId(sprintWithWrongFormatId)).toThrow(/expected number/i)
  })

  it('should accept correct format Id', () => {
    const validId = 10

    expect(parseId(validId)).toBe(validId)
  })
})

describe('parseSprinCode', () => {
  it('should not accept wrong format sprintcode', () => {
    const shortSprintCode = 'WD-1'

    expect(() => parseSprintCode(shortSprintCode)).toThrow(/short/i)
  })

  it('should accept correct format sprintcode', () => {
    const validCode = 'WD-1.1'
    expect(parseSprintCode(validCode)).toBe(validCode)
  })
})
