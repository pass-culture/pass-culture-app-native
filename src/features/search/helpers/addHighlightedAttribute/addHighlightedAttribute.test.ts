import { mockedSearchHistory } from 'features/search/fixtures/mockedSearchHistory'
import { addHighlightedAttribute } from 'features/search/helpers/addHighlightedAttribute/addHighlightedAttribute'

describe('addHighlightedAttribute', () => {
  it('should return an item without highlighting when query is an empty string', () => {
    const attribute = addHighlightedAttribute({ item: mockedSearchHistory[0], query: '' })

    expect(attribute).toEqual({
      _highlightResult: { query: { value: 'manga' } },
      createdAt: 1695632460000,
      query: 'manga',
      label: 'manga',
    })
  })

  it('should return an item with highlighting when query is not an empty string', () => {
    const attribute = addHighlightedAttribute({ item: mockedSearchHistory[0], query: 'man' })

    expect(attribute).toEqual({
      _highlightResult: { query: { value: '<mark>man</mark>ga' } },
      createdAt: 1695632460000,
      query: 'manga',
      label: 'manga',
    })
  })
})
