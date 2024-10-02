import React from 'react'

import { CategoryIdEnum } from 'api/gen'
import { OfferImageContainer } from 'features/offer/components/OfferImageContainer/OfferImageContainer'
import { render, screen } from 'tests/utils/web'

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

const mockOnPress = jest.fn()

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<OfferImageContainer />', () => {
  it('should not display carousel with one image', () => {
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

  it('should display carousel with several images', () => {
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
