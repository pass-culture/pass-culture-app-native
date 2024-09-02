import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { OfferResponseV2 } from 'api/gen'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { OfferPreview } from 'features/offer/pages/OfferPreview/OfferPreview'
import { render, screen } from 'tests/utils'

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

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<OfferPreview />', () => {
  it('should display offer preview page', () => {
    render(<OfferPreview />)

    expect(screen.getByText('1/2')).toBeOnTheScreen()
  })

  it('should display the right image in carousel when a default index is provided', () => {
    useRoute.mockReturnValueOnce({ params: { id: '1', defaultIndex: 1 } })
    render(<OfferPreview />)

    expect(screen.getByText('2/2')).toBeOnTheScreen()
  })
})
