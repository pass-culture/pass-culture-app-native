import React from 'react'

import { OfferResponse } from 'api/gen'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { OfferPreview } from 'features/offer/pages/OfferPreview/OfferPreview'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { render, screen } from 'tests/utils'

const mockFeatureFlag = jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(true)

const mockOffer = jest.fn((): { data: OfferResponse } => ({
  data: offerResponseSnap,
}))

jest.mock('features/offer/api/useOffer', () => ({
  useOffer: () => mockOffer(),
}))

jest.useFakeTimers()

describe('<OfferPreview />', () => {
  describe('when the feature flag is enabled', () => {
    beforeAll(() => {
      mockFeatureFlag.mockReturnValue(true)
    })

    it('should display offer preview page', () => {
      render(<OfferPreview />)

      expect(screen.getByText('1/3')).toBeOnTheScreen()
    })
  })

  describe('when the feature flag is disabled', () => {
    beforeAll(() => {
      mockFeatureFlag.mockReturnValue(false)
    })

    it('should display offer preview page', () => {
      render(<OfferPreview />)

      expect(screen.getByText('1/1')).toBeOnTheScreen()
    })

    it('should not display offer preview page when there is not an image', () => {
      mockOffer.mockReturnValueOnce({
        data: { ...offerResponseSnap, image: null },
      })
      render(<OfferPreview />)

      expect(screen.queryByText('1/1')).not.toBeOnTheScreen()
    })
  })
})
