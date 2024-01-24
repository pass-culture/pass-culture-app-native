import React from 'react'

import { fixtureApiAddressDataGouv } from 'features/search/fixtures/apiAddressDataGouv'
import { SuggestedPlaces } from 'features/search/pages/SuggestedPlacesOrVenues/SuggestedPlaces'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen } from 'tests/utils'

const mockSetSelectedPlace = jest.fn()

describe('<SuggestedPlaces/>', () => {
  it('should show suggested places when searching a place', async () => {
    mockApiAdresse(fixtureApiAddressDataGouv)
    renderSuggestedPlaces('aix')

    expect(await screen.findByText('Aix-en-Provence')).toBeOnTheScreen()
  })

  it('should show help message when there are no results', async () => {
    mockApiAdresse({
      type: 'FeatureCollection',
      version: 'draft',
      features: [],
      attribution: 'BAN',
      licence: 'ETALAB-2.0',
      query: 'jhbjhbjhbjhb',
      limit: 20,
    })
    renderSuggestedPlaces('jhbjhbjhbjhb')

    expect(
      await screen.findByText('Aucune localisation ne correspond à ta recherche')
    ).toBeOnTheScreen()
  })

  it('should not show help message when the query is empty', async () => {
    renderSuggestedPlaces('')

    await act(() => {})

    expect(
      screen.queryByText('Aucune localisation ne correspond à ta recherche')
    ).not.toBeOnTheScreen()
  })

  it('should show loader when loading', async () => {
    mockApiAdresse(fixtureApiAddressDataGouv)

    renderSuggestedPlaces('aix')

    expect(screen.queryByTestId('loader')).toBeOnTheScreen()

    await act(() => {})
  })
})

const renderSuggestedPlaces = (query: string) => {
  render(
    reactQueryProviderHOC(<SuggestedPlaces query={query} setSelectedPlace={mockSetSelectedPlace} />)
  )
}

const mockApiAdresse = (mockResponse: Record<string, unknown>) => {
  mockServer.universalGet('https://api-adresse.data.gouv.fr/search', mockResponse)
}
