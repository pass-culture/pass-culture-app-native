import { ensureEndingDot } from 'libs/parsers/ensureEndingDot'

describe('ensureEndingDot', () => {
  it('should add a dot if the string does not end with one', () => {
    expect(ensureEndingDot('This is a sentence')).toEqual('This is a sentence.')
  })

  it('should return the same string if it already ends with a dot', () => {
    expect(ensureEndingDot('This is a sentence.')).toEqual('This is a sentence.')
  })

  it('should trim the string before checking for a dot', () => {
    expect(ensureEndingDot('  This is a sentence  ')).toEqual('This is a sentence.')
  })

  it('should return an empty string if the input is empty', () => {
    expect(ensureEndingDot('')).toEqual('')
  })

  it('should not add a dot if the string ends with an exclamation mark or question mark', () => {
    expect(ensureEndingDot('Really?')).toEqual('Really?')
    expect(ensureEndingDot('Amazing!')).toEqual('Amazing!')
  })
})
