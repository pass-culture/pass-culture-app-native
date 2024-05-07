import React from 'react'

import { OfferResponseV2 } from 'api/gen'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { OfferPreview } from 'features/offer/pages/OfferPreview/OfferPreview'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { render, screen } from 'tests/utils'

const mockFeatureFlag = jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(true)

const mockOffer = jest.fn((): { data: OfferResponseV2 } => ({
  data: {
    ...offerResponseSnap,
    images: {
      ...offerResponseSnap.images,
      image2: {
        url: 'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/products/CHSYS',
        credit: 'Author: photo credit author',
      },
    },
  },
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

      expect(screen.getByText('1/2')).toBeOnTheScreen()
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
        data: { ...offerResponseSnap, images: null },
      })
      render(<OfferPreview />)

      expect(screen.queryByText('1/1')).not.toBeOnTheScreen()
    })
  })
})
