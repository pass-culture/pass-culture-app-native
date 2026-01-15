import React from 'react'

import { OfferPageBridge } from 'features/offer/bridge/OfferPageBridge'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, screen } from 'tests/utils'

jest.mock('features/offer/pages/Offer/Offer', () => ({
  Offer: () => {
    const { View } = jest.requireActual('react-native')
    return <View testID="offer" />
  },
}))

jest.mock('features/offerRefacto/pages/OfferPage', () => ({
  Offer: () => {
    const { View } = jest.requireActual('react-native')
    return <View testID="offerRefacto" />
  },
}))

describe('OfferPageBridge', () => {
  it('should use old offer code when wipOfferRefacto FF deactivated', () => {
    setFeatureFlags()
    render(<OfferPageBridge />)

    expect(screen.getByTestId('offer')).toBeOnTheScreen()
    expect(screen.queryByTestId('offerRefacto')).not.toBeOnTheScreen()
  })

  it('should use refacto offer code when wipOfferRefacto FF activated', () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_OFFER_REFACTO])

    render(<OfferPageBridge />)

    expect(screen.getByTestId('offerRefacto')).toBeOnTheScreen()
    expect(screen.queryByTestId('offer')).not.toBeOnTheScreen()
  })
})
