import React from 'react'

import { CategoryIdEnum } from 'api/gen'
import { OfferImageContainer } from 'features/offer/components/OfferImageContainer/OfferImageContainer'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { render, screen } from 'tests/utils/web'

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

const mockOnPress = jest.fn()

describe('<OfferImageContainer />', () => {
  it('should not display carousel with one image', () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)
    render(
      <OfferImageContainer
        imageUrls={['some_url_to_some_resource']}
        categoryId={CategoryIdEnum.CINEMA}
        onPress={mockOnPress}
      />,
      { theme: { isDesktopViewport: true } }
    )

    expect(screen.getByTestId('offerImageWithoutCarousel')).toBeInTheDocument()
  })

  it('should not display carousel with feature flag off', () => {
    useFeatureFlagSpy.mockReturnValueOnce(false)
    render(
      <OfferImageContainer
        imageUrls={['some_url_to_some_resource', 'some_url2_to_some_resource']}
        categoryId={CategoryIdEnum.CINEMA}
        onPress={mockOnPress}
      />,
      { theme: { isDesktopViewport: true } }
    )

    expect(screen.getByTestId('offerImageWithoutCarousel')).toBeInTheDocument()
  })

  it('should display carousel with several images', () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)

    render(
      <OfferImageContainer
        imageUrls={['some_url_to_some_resource', 'some_url2_to_some_resource']}
        categoryId={CategoryIdEnum.CINEMA}
        onPress={mockOnPress}
      />,
      { theme: { isDesktopViewport: true } }
    )

    expect(screen.queryByTestId('offerImageWithoutCarousel')).not.toBeInTheDocument()
  })
})
