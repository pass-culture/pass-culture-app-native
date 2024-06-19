import React from 'react'

import { CategoryIdEnum } from 'api/gen'
import { OfferImageContainer } from 'features/offer/components/OfferImageContainer/OfferImageContainer'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { render, screen } from 'tests/utils/web'

jest.mock('libs/subcategories/useCategoryId')
jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

const mockOnPress = jest.fn()

beforeEach(() => {
  mockOnPress.mockReset()
})

describe('<OfferImageContainer />', () => {
  it('should not call onPress when viewport is not desktop', () => {
    render(
      <OfferImageContainer
        imageUrls={['some_url_to_some_resource']}
        categoryId={CategoryIdEnum.CINEMA}
        onPress={mockOnPress}
      />,
      { theme: { isDesktopViewport: false } }
    )

    expect(screen.queryByTestId('header.touchable')).toBeNull()
  })

  it('should render correctly without feature flags', () => {
    useFeatureFlagSpy.mockReturnValueOnce(false)
    render(
      <OfferImageContainer
        imageUrls={['some_url_to_some_resource']}
        categoryId={CategoryIdEnum.CINEMA}
        onPress={mockOnPress}
      />,
      { theme: { isDesktopViewport: true } }
    )

    expect(screen).toMatchSnapshot()
  })

  it('should render correctly with feature flags', () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)

    render(
      <OfferImageContainer
        imageUrls={['some_url_to_some_resource']}
        categoryId={CategoryIdEnum.CINEMA}
        onPress={mockOnPress}
      />,
      { theme: { isDesktopViewport: true } }
    )

    expect(screen).toMatchSnapshot()
  })
})
