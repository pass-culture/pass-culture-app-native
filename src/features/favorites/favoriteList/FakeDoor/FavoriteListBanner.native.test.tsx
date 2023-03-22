import React from 'react'

import { FavoriteListBanner } from 'features/favorites/favoriteList/FakeDoor/FavoriteListBanner'
import { analytics } from 'libs/firebase/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { fireEvent, render, screen } from 'tests/utils'

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)

describe('FavoriteListBanner', () => {
  it('should return null when feature flag is not activated', () => {
    useFeatureFlagSpy.mockReturnValueOnce(false)
    render(<FavoriteListBanner />)
    expect(screen.toJSON()).toBeNull()
  })
  it('should open modal when clicking the banner', () => {
    render(<FavoriteListBanner />)

    const banner = screen.getByText('Crée une liste de favoris')
    fireEvent.press(banner)
    expect(screen.getByText('Encore un peu de patience...')).toBeTruthy()
  })

  it('should log when the user sees favorite list banner', () => {
    render(<FavoriteListBanner />)

    expect(analytics.logFavoriteListDisplayed).toHaveBeenNthCalledWith(1, 'favorites')
  })

  it('should log when the user presses favorite list banner', () => {
    render(<FavoriteListBanner />)

    const banner = screen.getByText('Crée une liste de favoris')
    fireEvent.press(banner)

    expect(analytics.logFavoriteListButtonClicked).toHaveBeenNthCalledWith(1, 'favorites')
  })
})
