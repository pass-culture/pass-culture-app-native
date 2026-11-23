import { getTextLinks } from 'ui/components/CollapsibleText/helpers/getTextLinks'

describe('getTextLinks', () => {
  it('should return the links found in the text', () => {
    expect(getTextLinks('Voir www.example.com et https://passculture.app/offre pour plus')).toEqual(
      ['www.example.com', 'https://passculture.app/offre']
    )
  })

  it('should return an empty list when the text has no link', () => {
    expect(getTextLinks('Lorem ipsum dolor sit amet.')).toEqual([])
  })
})
