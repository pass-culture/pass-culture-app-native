import { formatSnakeCase } from '../formatSnakeCase'

describe('formatSnakeCase', () => {
  it.each`
    inputString              | expected
    ${'city_mapper'}         | ${'City mapper'}
    ${'snake'}               | ${'Snake'}
    ${'snake_case_but_long'} | ${'Snake case but long'}
  `('should transform "$inputString" in "$expected"', ({ inputString, expected }) => {
    expect(formatSnakeCase(inputString)).toBe(expected)
  })
})
