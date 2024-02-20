import React from 'react'

import { FavoriteListBanner } from 'features/favorites/favoriteList/FakeDoor/FavoriteListBanner'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { render, screen } from 'tests/utils'

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)

describe('FavoriteListBanner', () => {
  it('should return null when feature flag is not activated', () => {
    useFeatureFlagSpy.mockReturnValueOnce(false)
    render(<FavoriteListBanner />)

    expect(screen.toJSON()).not.toBeOnTheScreen()
  })
})
