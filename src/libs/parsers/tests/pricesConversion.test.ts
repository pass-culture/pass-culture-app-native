import { convertCentsToEuros, convertEuroToCents } from 'libs/parsers/pricesConversion'

describe('pricesConversion', () => {
  it.each`
    euros   | cents
    ${10}   | ${1000}
    ${9.99} | ${999}
    ${100}  | ${10000}
    ${1000} | ${100000}
  `('convertEuroToCents($euros) \t= $cents', ({ euros, cents }) => {
    expect(convertEuroToCents(euros)).toBe(cents)
  })

  it.each`
    cents  | euros
    ${50}  | ${0}
    ${99}  | ${0}
    ${100} | ${1}
    ${101} | ${1}
  `('convertCentsToEuros($euro) \t= $cents', ({ cents, euros }) => {
    expect(convertCentsToEuros(cents)).toBe(euros)
  })
})
