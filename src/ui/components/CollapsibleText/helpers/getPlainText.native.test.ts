import { getPlainText } from 'ui/components/CollapsibleText/helpers/getPlainText'

describe('getPlainText', () => {
  it('should remove bold and italic markers', () => {
    expect(getPlainText('Lorem **ipsum** dolor _sit_ amet.')).toBe('Lorem ipsum dolor sit amet.')
  })

  it('should keep text without markdown unchanged', () => {
    expect(getPlainText('Lorem ipsum dolor sit amet.')).toBe('Lorem ipsum dolor sit amet.')
  })
})
