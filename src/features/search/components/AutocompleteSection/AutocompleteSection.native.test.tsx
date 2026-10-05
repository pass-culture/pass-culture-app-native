import React from 'react'
import { Text } from 'react-native'

import { render } from 'tests/utils'

import { AutocompleteSection } from './AutocompleteSection'

let mockHits = [{ objectID: 'first', name: 'Premier lieu', __queryID: 'tracking-1' }]
let mockQuery = 'lieu'
jest.mock('react-instantsearch-core', () => ({
  useInfiniteHits: () => ({ hits: mockHits, results: { query: mockQuery } }),
}))

describe('AutocompleteSection snapshots', () => {
  it('reports replacements and label changes with the result query, excluding analytics changes', () => {
    const onSuggestionsChange = jest.fn()
    const section = (
      <AutocompleteSection
        title="Lieux"
        onSuggestionsChange={onSuggestionsChange}
        renderItem={() => <Text>Lieu</Text>}
      />
    )
    const { rerender } = render(section)

    expect(onSuggestionsChange).toHaveBeenLastCalledWith({
      query: 'lieu',
      itemKeys: [JSON.stringify(['first', null, 'Premier lieu', null])],
    })

    mockHits = [{ objectID: 'second', name: 'Deuxième lieu', __queryID: 'tracking-2' }]
    mockQuery = 'lieux'
    rerender(React.cloneElement(section))

    expect(onSuggestionsChange).toHaveBeenLastCalledWith({
      query: 'lieux',
      itemKeys: [JSON.stringify(['second', null, 'Deuxième lieu', null])],
    })

    mockHits = [{ objectID: 'second', name: 'Lieu renommé', __queryID: 'tracking-3' }]
    rerender(React.cloneElement(section))

    expect(onSuggestionsChange).toHaveBeenCalledTimes(3)

    mockHits = [{ objectID: 'second', name: 'Lieu renommé', __queryID: 'tracking-4' }]
    rerender(React.cloneElement(section))

    expect(onSuggestionsChange).toHaveBeenCalledTimes(3)

    mockHits = []
    rerender(React.cloneElement(section))

    expect(onSuggestionsChange).toHaveBeenLastCalledWith({ query: 'lieux', itemKeys: [] })
  })
})
