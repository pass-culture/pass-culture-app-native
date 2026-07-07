import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { mockArtist } from 'features/artist/fixtures/mockArtist'
import { initialSearchState } from 'features/search/context/reducer'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { analytics } from 'libs/analytics/provider'
import { Offer } from 'shared/offer/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

import { VerticalPlaylistOffersView } from './VerticalPlaylistOffersView'

jest.mock('libs/firebase/analytics/analytics')

const mockSearchState = initialSearchState
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({ searchState: mockSearchState, searchId: 'fakeSearchId' }),
}))

const mockHitsItems: Offer[] = [
  mockedAlgoliaResponse.hits[0],
  mockedAlgoliaResponse.hits[1],
  mockedAlgoliaResponse.hits[2],
]

const user = userEvent.setup()

jest.useFakeTimers()

describe('<VerticalPlaylistOffersView />', () => {
  it('should render correctly', async () => {
    render(
      reactQueryProviderHOC(
        <VerticalPlaylistOffersView
          title="My title"
          subtitle="My subtitle"
          items={mockHitsItems}
          searchQuery="query"
          analyticsFrom="searchresults"
        />
      )
    )

    await screen.findAllByText('My title')

    expect(screen).toMatchSnapshot()
  })

  it('should render title and number of offers', async () => {
    render(
      reactQueryProviderHOC(
        <VerticalPlaylistOffersView
          title="My title"
          subtitle="My subtitle"
          items={mockHitsItems}
          searchQuery="query"
          analyticsFrom="searchresults"
        />
      )
    )

    await screen.findAllByText('My title')

    expect(screen.getAllByText('My title')[0]).toBeOnTheScreen()
    expect(screen.getByText('My subtitle')).toBeOnTheScreen()
    expect(screen.getByText('3 offres')).toBeOnTheScreen()
  })

  it('should display artist button when artist specified', async () => {
    render(
      reactQueryProviderHOC(
        <VerticalPlaylistOffersView
          title="My title"
          subtitle="My subtitle"
          items={mockHitsItems}
          searchQuery="query"
          analyticsFrom="searchresults"
          artist={mockArtist}
        />
      )
    )

    expect(
      await screen.findByLabelText('Accéder à la page artiste de Avril Lavigne')
    ).toBeOnTheScreen()
  })

  it('should not display artist button when artistId not specified', async () => {
    render(
      reactQueryProviderHOC(
        <VerticalPlaylistOffersView
          title="My title"
          subtitle="My subtitle"
          items={mockHitsItems}
          searchQuery="query"
          analyticsFrom="searchresults"
        />
      )
    )

    await screen.findAllByText('My title')

    expect(screen.queryByLabelText('Accéder à la page artiste de Artist 1')).not.toBeOnTheScreen()
  })

  it('should navigate on artist page when pressing artist button', async () => {
    render(
      reactQueryProviderHOC(
        <VerticalPlaylistOffersView
          title="My title"
          subtitle="My subtitle"
          items={mockHitsItems}
          searchQuery="query"
          analyticsFrom="searchresults"
          artist={mockArtist}
        />
      )
    )

    await user.press(await screen.findByLabelText('Accéder à la page artiste de Avril Lavigne'))

    expect(navigate).toHaveBeenCalledWith('Artist', { id: mockArtist.id })
  })

  it('should trigger ConsultArtist log when pressing artist button', async () => {
    render(
      reactQueryProviderHOC(
        <VerticalPlaylistOffersView
          title="My title"
          subtitle="My subtitle"
          items={mockHitsItems}
          searchQuery="query"
          analyticsFrom="home"
          artist={mockArtist}
        />
      )
    )

    await user.press(await screen.findByLabelText('Accéder à la page artiste de Avril Lavigne'))

    expect(analytics.logConsultArtist).toHaveBeenCalledWith({
      artistId: mockArtist.id,
      artistName: mockArtist.name,
      from: 'home',
      originDetails: 'artistRecommendation',
    })
  })
})
