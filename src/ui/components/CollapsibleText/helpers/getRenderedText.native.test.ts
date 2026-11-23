import { getRenderedText } from 'ui/components/CollapsibleText/helpers/getRenderedText'

describe('getRenderedText', () => {
  it('should remove markdown markers', () => {
    expect(getRenderedText('Lorem **ipsum** dolor _sit_ amet.')).toBe('Lorem ipsum dolor sit amet.')
  })

  it('should prefix links without scheme as they are displayed', () => {
    expect(getRenderedText('Voir www.example.com et **www.passculture.app** pour plus')).toBe(
      'Voir http://www.example.com et http://www.passculture.app pour plus'
    )
  })

  it('should keep links with a scheme unchanged', () => {
    expect(getRenderedText('Voir https://passculture.app/offre pour plus')).toBe(
      'Voir https://passculture.app/offre pour plus'
    )
  })
})
