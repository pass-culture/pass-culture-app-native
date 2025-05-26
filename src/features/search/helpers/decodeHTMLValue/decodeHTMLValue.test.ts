import { decodeHTMLValue } from 'features/search/helpers/decodeHTMLValue/decodeHTMLValue'

describe('decodeHTMLValue', () => {
  it('should return a string with encoded marks', () => {
    const attribute = decodeHTMLValue('&lt;em&gt;test&lt;/em&gt;')

    expect(attribute).toEqual('<mark>test</mark>')
  })

  it('should encode properly single quotes', () => {
    const attribute = decodeHTMLValue('&#39;test&#39;')

    expect(attribute).toEqual("'test'")
  })

  it('should encode properly commercial and', () => {
    const attribute = decodeHTMLValue('dupond&amp;dupont')

    expect(attribute).toEqual('dupond&dupont')
  })
})
