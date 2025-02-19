import React from 'react'

import { FILTERS_VENUE_TYPE_MAPPING } from 'features/venueMap/constant'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, screen } from 'tests/utils'

import { FilterBannerContainer } from './FilterBannerContainer'

describe('FilterBannerConainer', () => {
  it('should render FilterCategoriesBannerContainer if FF is enabled', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_VENUE_MAP_TYPE_FILTER_V2])

    render(<FilterBannerContainer />)
    await screen.findAllByTestId(/[A-Z]+Label/)

    Object.keys(FILTERS_VENUE_TYPE_MAPPING).forEach((id) => {
      expect(screen.getByTestId(`${id}Label`)).toBeOnTheScreen()
    })
  })

  it('should render SingleFilterBannerContainer if FF is disabled', async () => {
    setFeatureFlags()

    render(<FilterBannerContainer />)

    expect(await screen.findByText('Tous les lieux')).toBeOnTheScreen()
  })
})
