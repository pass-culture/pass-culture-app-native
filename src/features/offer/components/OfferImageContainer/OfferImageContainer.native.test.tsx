import React from 'react'

import { CategoryIdEnum } from 'api/gen'
import { OfferImageContainer } from 'features/offer/components/OfferImageContainer/OfferImageContainer'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { render, screen, waitFor } from 'tests/utils'

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

describe('<OfferImageContainer />', () => {
  it('should display camera tag when offer preview feature flag activated and image url defined', () => {
    render(
      <OfferImageContainer
        imageUrl="some_url_to_some_resource"
        categoryId={CategoryIdEnum.CINEMA}
        shouldDisplayOfferPreview
      />
    )

    expect(screen.getByTestId('imageTag')).toBeOnTheScreen()
  })

  it('should not display camera tag when offer preview feature flag deactivated and image url defined', () => {
    render(
      <OfferImageContainer
        imageUrl="some_url_to_some_resource"
        categoryId={CategoryIdEnum.CINEMA}
      />
    )

    expect(screen.queryByTestId('imageTag')).not.toBeOnTheScreen()
  })

  it('should not display camera tag when offer preview feature flag activated and image url not defined', () => {
    render(<OfferImageContainer categoryId={CategoryIdEnum.CINEMA} shouldDisplayOfferPreview />)

    expect(screen.queryByTestId('imageTag')).not.toBeOnTheScreen()
  })

  describe('When wipOfferPreviewWithCarousel feature flag deactivated', () => {
    beforeEach(() => {
      useFeatureFlagSpy.mockReturnValueOnce(false)
    })

    it('should display image outside carousel when image url defined', () => {
      render(
        <OfferImageContainer
          imageUrl="some_url_to_some_resource"
          categoryId={CategoryIdEnum.CINEMA}
        />
      )

      expect(screen.getByTestId('offerImageWithoutCarousel')).toBeOnTheScreen()
      expect(screen.getByTestId('offerBodyImage')).toBeOnTheScreen()
    })

    it('should display image placeholder outside carousel when image url defined', () => {
      render(<OfferImageContainer categoryId={CategoryIdEnum.CINEMA} />)

      expect(screen.getByTestId('offerImageWithoutCarousel')).toBeOnTheScreen()
      expect(screen.getByTestId('imagePlaceholder')).toBeOnTheScreen()
    })
  })

  describe('When wipOfferPreviewWithCarousel feature flag activated', () => {
    beforeEach(() => {
      useFeatureFlagSpy.mockReturnValueOnce(true)
    })

    it('should display image inside carousel when image url defined', async () => {
      render(
        <OfferImageContainer
          imageUrl="some_url_to_some_resource"
          categoryId={CategoryIdEnum.CINEMA}
        />
      )

      await waitFor(() => {
        expect(screen.getByTestId('offerImageContainerCarousel')).toBeOnTheScreen()
      })
    })

    it('should display carousel dots when image url defined', async () => {
      render(
        <OfferImageContainer
          imageUrl="some_url_to_some_resource"
          categoryId={CategoryIdEnum.CINEMA}
        />
      )

      await waitFor(() => {
        expect(screen.getByTestId('offerImageContainerDots')).toBeOnTheScreen()
      })
    })

    it('should display image placeholder outside carousel when image url defined', () => {
      render(<OfferImageContainer categoryId={CategoryIdEnum.CINEMA} />)

      expect(screen.getByTestId('offerImageWithoutCarousel')).toBeOnTheScreen()
      expect(screen.getByTestId('imagePlaceholder')).toBeOnTheScreen()
    })
  })
})
