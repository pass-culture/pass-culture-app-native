import React from 'react'

import { FILTERS_VENUE_TYPE_MAPPING } from 'features/venueMap/constant'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { render, screen } from 'tests/utils'

import { FilterBannerContainer } from './FilterBannerContainer'

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag')

describe('FilterBannerConainer', () => {
  beforeEach(() => {
    useFeatureFlagSpy.mockReturnValue(true)
  })

  it('should render FilterCategoriesBannerContainer if FF is enabled', async () => {
    render(<FilterBannerContainer />)
    await screen.findAllByTestId(/[A-Z]+Label/)

    Object.keys(FILTERS_VENUE_TYPE_MAPPING).forEach((id) => {
      expect(screen.getByTestId(`${id}Label`)).toBeOnTheScreen()
    })
  })

  it('should render SingleFilterBannerContainer if FF is disabled', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(false)

    render(<FilterBannerContainer />)

    expect(await screen.findByLabelText('Tous les lieux')).toBeOnTheScreen()
  })
})
