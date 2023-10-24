import { extractExternalLinkParts } from 'ui/components/buttons/externalLink/ExternalLink.service'

describe('decomposeFirstWordAndRemainingText', () => {
  it('should return only one non empty word', () => {
    const text = 'oneWord'
    const result = extractExternalLinkParts(text)

    expect(result).toEqual(['', '\u00a0oneWord'])
  })

  it('should return splitted text', () => {
    const text = 'one and three words'
    const result = extractExternalLinkParts(text)

    expect(result).toEqual(['\u00a0one', ' and three words'])
  })

  it('should return splitted text even with space after and before text', () => {
    const text = ' some text with several words  '
    const result = extractExternalLinkParts(text)

    expect(result).toEqual(['\u00a0some', ' text with several words'])
  })
})
