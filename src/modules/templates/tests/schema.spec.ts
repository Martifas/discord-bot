import { parse, parseInsertable, parseUpdatable } from '../schema'
import { fakeTemplateFull } from './utils'

it('parses a valid record', () => {
  const record = fakeTemplateFull()
  expect(parse(record)).toEqual(record)
})

it('throws an error due to empty/missing template', () => {
  const templateWithoutTemplate = {
    id: 11,
    template: '',
  }
  expect(() => parse(templateWithoutTemplate)).toThrow(/template/i)
})

describe('parseInsertable', () => {
  it('omits id', () => {
    const parsed = parseInsertable(fakeTemplateFull())

    expect(parsed).not.toHaveProperty('id')
  })
})

describe('parseUpdatable', () => {
  it('omits id', () => {
    const parsed = parseUpdatable(fakeTemplateFull())

    expect(parsed).not.toHaveProperty('id')
  })
})
