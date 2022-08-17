import React from 'react'
import { Animated, Platform, Share } from 'react-native'

import { offerResponseSnap } from 'features/offer/api/snaps/offerResponseSnap'
import { OfferHeader } from 'features/offer/components/OfferHeader'
import { getOfferUrl } from 'features/offer/services/useShareOffer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, superFlushWithAct } from 'tests/utils'

const url = getOfferUrl(offerResponseSnap.id)
const title = "Je t'invite à découvrir une super offre sur le pass Culture\u00a0!"
const message = `Retrouve "${offerResponseSnap.name}" chez "${offerResponseSnap.venue.name}" sur le pass Culture`
// const messageWithUrl = `${message}\n\n${url}`

describe('<OfferHeader />', () => {
  Platform.OS = 'ios'

  it('should call Share with the right arguments on IOS', async () => {
    const share = jest.spyOn(Share, 'share')
    const { getByTestId } = await renderOfferHeader()

    await superFlushWithAct()

    fireEvent.press(getByTestId('icon-share'))

    expect(share).toHaveBeenNthCalledWith(
      1,
      { message, title, url },
      { dialogTitle: title, subject: title }
    )
  })
})

async function renderOfferHeader() {
  const animatedValue = new Animated.Value(0)
  return render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(
      <OfferHeader
        title={offerResponseSnap.name}
        headerTransition={animatedValue}
        offerId={offerResponseSnap.id}
      />
    )
  )
}
