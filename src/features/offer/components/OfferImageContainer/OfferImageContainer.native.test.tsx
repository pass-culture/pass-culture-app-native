import React from 'react'

import { CategoryIdEnum } from 'api/gen'
import { OfferImageContainer } from 'features/offer/components/OfferImageContainer/OfferImageContainer'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { render, screen, waitFor } from 'tests/utils'

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

describe('<OfferImageContainer />', () => {
  describe('When wipOfferPreviewWithCarousel feature flag deactivated', () => {
    beforeEach(() => {
      useFeatureFlagSpy.mockReturnValueOnce(false)
    })

    it('should display image outside carousel when image url defined', () => {
      render(
        <OfferImageContainer
          imageUrls={['some_url_to_some_resource']}
          categoryId={CategoryIdEnum.CINEMA}
          onPress={jest.fn()}
        />
      )

      expect(screen.getByTestId('offerImageWithoutCarousel')).toBeOnTheScreen()
      expect(screen.getByTestId('offerBodyImage')).toBeOnTheScreen()
    })

    it('should display image placeholder outside carousel when image url defined', () => {
      render(<OfferImageContainer categoryId={CategoryIdEnum.CINEMA} onPress={jest.fn()} />)

      expect(screen.getByTestId('offerImageWithoutCarousel')).toBeOnTheScreen()
      expect(screen.getByTestId('imagePlaceholder')).toBeOnTheScreen()
    })
  })

  describe('When wipOfferPreviewWithCarousel feature flag activated', () => {
    beforeEach(() => {
      useFeatureFlagSpy.mockReturnValueOnce(true)
    })

    it('should not display image inside carousel when offer has only one image', () => {
      render(
        <OfferImageContainer
          imageUrls={['some_url_to_some_resource']}
          categoryId={CategoryIdEnum.CINEMA}
          onPress={jest.fn()}
        />
      )

      expect(screen.queryByTestId('offerImageContainerCarousel')).not.toBeOnTheScreen()
    })

    it('should not display carousel dots when offer has only one', () => {
      render(
        <OfferImageContainer
          imageUrls={['some_url_to_some_resource']}
          categoryId={CategoryIdEnum.CINEMA}
          onPress={jest.fn()}
        />
      )

      expect(screen.queryByTestId('offerImageContainerDots')).not.toBeOnTheScreen()
    })

    it('should display image inside carousel when offer has several images', async () => {
      render(
        <OfferImageContainer
          imageUrls={['some_url_to_some_resource', 'some_url2_to_some_resource']}
          categoryId={CategoryIdEnum.CINEMA}
          onPress={jest.fn()}
        />
      )

      await waitFor(() => {
        expect(screen.getByTestId('offerImageContainerCarousel')).toBeOnTheScreen()
      })
    })

    it('should display carousel dots when offer has several images', async () => {
      render(
        <OfferImageContainer
          imageUrls={['some_url_to_some_resource', 'some_url2_to_some_resource']}
          categoryId={CategoryIdEnum.CINEMA}
          onPress={jest.fn()}
        />
      )

      expect(await screen.findByTestId('offerImageContainerDots')).toBeOnTheScreen()
    })

    it('should display image placeholder outside carousel when image url defined', () => {
      render(<OfferImageContainer categoryId={CategoryIdEnum.CINEMA} onPress={jest.fn()} />)

      expect(screen.getByTestId('offerImageWithoutCarousel')).toBeOnTheScreen()
      expect(screen.getByTestId('imagePlaceholder')).toBeOnTheScreen()
    })
  })
})
