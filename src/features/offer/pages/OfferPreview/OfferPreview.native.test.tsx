import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { OfferResponseV2 } from 'api/gen'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { OfferPreview } from 'features/offer/pages/OfferPreview/OfferPreview'
import { renderAsync, screen } from 'tests/utils'

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

jest.mock('queries/offer/useOfferQuery', () => ({
  useOfferQuery: () => mockOffer(),
}))

jest.useFakeTimers()

describe('<OfferPreview />', () => {
  it('should display offer preview page', async () => {
    await renderAsync(<OfferPreview />)

    expect(await screen.findByText('Illustration 1 sur 2')).toBeOnTheScreen()
  })

  it('should display the right image in carousel when a default index is provided', async () => {
    useRoute.mockReturnValueOnce({ params: { id: '1', defaultIndex: 1 } })
    await renderAsync(<OfferPreview />)

    expect(await screen.findByText('Illustration 2 sur 2')).toBeOnTheScreen()
  })
})
