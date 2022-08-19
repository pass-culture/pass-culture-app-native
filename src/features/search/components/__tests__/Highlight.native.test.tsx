import React from 'react'

import { Highlight, HighlightPart } from 'features/search/components/Highlight'
import { AlgoliaSuggestionHit } from 'libs/algolia'
import { render } from 'tests/utils'

jest.mock('instantsearch.js/es/lib/utils/getPropertyByPath', () => ({
  __esModule: true, // this property makes it work
  default: () => ({
    value: {
      fullyHighlighted: false,
      matchLevel: 'full',
      matchedWords: ['guerre', 'et'],
      value: '<mark>guerre</mark> <mark>et</mark> youpi matin',
    },
  }),
}))

jest.mock('instantsearch.js/es/lib/utils/getHighlightedParts', () => ({
  __esModule: true, // this property makes it work
  default: () => [
    { value: 'guerre', isHighlighted: true },
    { value: ' ', isHighlighted: false },
    { value: 'et', isHighlighted: true },
    { value: ' youpi matin', isHighlighted: false },
  ],
}))

describe('Highlight component', () => {
  const hit: AlgoliaSuggestionHit = {
    objectID: 'guerre et youpi matin',
    query: 'guerre et youpi matin',
    _highlightResult: {
      fullyHighlighted: false,
      matchLevel: 'full',
      matchedWords: ['guerre', 'et'],
      value: '<mark>guerre</mark> <mark>et</mark> youpi matin',
    },
  }

  it('should render Highlight', () => {
    expect(render(<Highlight hit={hit} attribute="query" />)).toMatchSnapshot()
  })
})

describe('HighlightPart component', () => {
  const children = 'guerre et'

  it('should use body typo when the part of the hit is highlighted', () => {
    const { queryByTestId } = render(<HighlightPart isHighlighted>{children}</HighlightPart>)

    expect(queryByTestId('bodyTypo')).toBeTruthy()
  })

  it('should use button text typo when the part of the hit is not highlighted', () => {
    const { queryByTestId } = render(
      <HighlightPart isHighlighted={false}>{children}</HighlightPart>
    )

    expect(queryByTestId('buttonTextTypo')).toBeTruthy()
  })
})
