import React, { ComponentProps } from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { OfferResponse } from 'api/gen'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { OfferPreview } from 'features/offer/pages/OfferPreview/OfferPreview'
import { analytics } from 'libs/analytics/provider'
import { renderAsync, screen, userEvent } from 'tests/utils'

const mockOffer = jest.fn((): { data: OfferResponse } => ({
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

jest.mock('ui/components/ImagesCarousel/ImagesCarousel', () => {
  const MockedReact = jest.requireActual<typeof import('react')>('react')
  const { Text } = jest.requireActual<typeof import('react-native')>('react-native')
  const { ImagesCarousel: ActualImagesCarousel } = jest.requireActual<
    typeof import('ui/components/ImagesCarousel/ImagesCarousel')
  >('ui/components/ImagesCarousel/ImagesCarousel')

  return {
    ImagesCarousel: (props: ComponentProps<typeof ActualImagesCarousel>) =>
      MockedReact.createElement(
        MockedReact.Fragment,
        null,
        MockedReact.createElement(ActualImagesCarousel, props),
        MockedReact.createElement(
          Text,
          { onPress: () => props.onSnapToItem?.(1) },
          'Aller à l’illustration 2'
        )
      ),
  }
})

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

  it('should log OfferImagesScroll when changing image', async () => {
    const user = userEvent.setup()
    useRoute.mockReturnValueOnce({ params: { id: 42 } })
    await renderAsync(<OfferPreview />)

    await user.press(screen.getByText('Aller à l’illustration 2'))

    expect(analytics.logOfferImagesScroll).toHaveBeenCalledWith({
      offerId: 42,
      nbImages: 2,
      imageIndex: 1,
      from: 'offerPreview',
    })
  })
})
