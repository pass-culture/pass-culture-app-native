import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { mockArtist } from 'features/artist/fixtures/mockArtist'
import { Artist } from 'features/artist/pages/Artist'
import * as useGoBack from 'features/navigation/useGoBack'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: jest.fn(),
  canGoBack: jest.fn(() => true),
})

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')
jest.mock('libs/firebase/analytics/analytics')

const user = userEvent.setup()

describe('<Artist />', () => {
  useRoute.mockReturnValue({ params: { id: 'cb22d035-f081-4ccb-99d8-8f5725a8ac9c' } })

  beforeEach(() => {
    mockServer.getApi('/v1/subcategories/v2', subcategoriesDataTest)
    setFeatureFlags()
  })

  it('should display artist page content', async () => {
    mockServer.getApi(`/v1/artists/${mockArtist.id}`, mockArtist)
    render(reactQueryProviderHOC(<Artist />))

    expect((await screen.findAllByText('Avril Lavigne'))[0]).toBeOnTheScreen()
  })

  it('should trigger ClickExpandArtistBio log when pressing Voir plus button', async () => {
    mockServer.getApi(`/v1/artists/${mockArtist.id}`, mockArtist)
    render(reactQueryProviderHOC(<Artist />))

    const seeMoreButton = await screen.findByText('Voir plus')
    await user.press(seeMoreButton)

    expect(analytics.logClickExpandArtistBio).toHaveBeenNthCalledWith(1, {
      artistId: mockArtist.id,
      artistName: mockArtist.name,
      from: 'artist',
    })
  })

  it('should render page not found when there is no artist', async () => {
    mockServer.getApi(`/v1/artists/${mockArtist.id}`, {
      responseOptions: {
        statusCode: 404,
        data: {},
      },
    })
    render(reactQueryProviderHOC(<Artist />))

    expect(await screen.findByText('Page introuvable !')).toBeOnTheScreen()
  })
})
