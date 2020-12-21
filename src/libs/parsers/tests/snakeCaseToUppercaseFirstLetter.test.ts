import { snakeCaseToUppercaseFirstLetter } from '../snakeCaseToUppercaseFirstLetter'

describe('formatSnakeCase', () => {
  it.each`
    inputString              | expected
    ${'city_mapper'}         | ${'City mapper'}
    ${'snake'}               | ${'Snake'}
    ${'snake_case_but_long'} | ${'Snake case but long'}
  `('should transform "$inputString" in "$expected"', ({ inputString, expected }) => {
    expect(snakeCaseToUppercaseFirstLetter(inputString)).toBe(expected)
  })
})
