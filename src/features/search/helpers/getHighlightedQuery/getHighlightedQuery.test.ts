import { getHighlightedQuery } from 'features/search/helpers/getHighlightedQuery/getHighlightedQuery'

describe('getHighlightedQuery', () => {
  it('should return highlighted query', () => {
    const highlightedQuery = getHighlightedQuery('one piece', 'one')

    expect(highlightedQuery).toEqual('<mark>one</mark> piece')
  })

  it('should return highlighted query by handleling case insensitively', () => {
    const highlightedQuery = getHighlightedQuery('one piece', 'oNe')

    expect(highlightedQuery).toEqual('<mark>one</mark> piece')
  })

  it('should return highlighted query with special character', () => {
    const highlightedQuery = getHighlightedQuery('$one piece', '$one')

    expect(highlightedQuery).toEqual('<mark>$one</mark> piece')
  })

  it('should return query without highlightening when part to hightlight is an empty string', () => {
    const highlightedQuery = getHighlightedQuery('one piece', '')

    expect(highlightedQuery).toEqual('one piece')
  })
})
