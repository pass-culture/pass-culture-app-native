import React, { FunctionComponent } from 'react'
import { Text } from 'react-native'

import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { OfferModal } from 'shared/offer/enums'
import { OfferModalProps, useBookOfferModal } from 'shared/offer/helpers/useBookOfferModal'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, renderHook, screen } from 'tests/utils'
import { LINE_BREAK } from 'ui/theme/constants'

const mockBookingOfferModal = <Text>BookingOfferModal</Text>
jest.mock('features/bookOffer/pages/BookingOfferModal', () => ({
  BookingOfferModal: () => mockBookingOfferModal,
}))

jest.mock('ui/components/modals/useModal', () => ({
  useModal: jest.fn().mockReturnValue({
    visible: true,
    showModal: jest.fn(),
    hideModal: jest.fn(),
  }),
}))

const TestOfferModal: FunctionComponent<OfferModalProps> = (props) => {
  const { OfferModal } = useBookOfferModal(props)
  return OfferModal
}

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('useOfferModal', () => {
  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
  })

  it('do not display anything when there is no modal to display', () => {
    const { result } = renderHook(() =>
      useBookOfferModal({ offerId: 1000, from: StepperOrigin.OFFER })
    )

    expect(result.current.OfferModal).toBeNull()
  })

  it('should return application processing modal when asked', () => {
    render(
      reactQueryProviderHOC(
        <TestOfferModal
          modalToDisplay={OfferModal.APPLICATION_PROCESSING}
          offerId={1000}
          from={StepperOrigin.OFFER}
        />
      )
    )

    expect(screen.getByText('C’est pour bientôt\u00a0!')).toBeOnTheScreen()
  })

  it('should return authentication modal when asked', () => {
    render(
      <TestOfferModal
        modalToDisplay={OfferModal.AUTHENTICATION}
        offerId={1000}
        from={StepperOrigin.OFFER}
      />
    )

    expect(
      screen.getByText('Identifie-toi' + LINE_BREAK + 'pour réserver l’offre')
    ).toBeOnTheScreen()
  })

  it('should return booking modal when asked', () => {
    render(
      <TestOfferModal
        modalToDisplay={OfferModal.BOOKING}
        offerId={1000}
        from={StepperOrigin.OFFER}
      />
    )

    expect(screen.getByText('BookingOfferModal')).toBeOnTheScreen()
  })

  it('should return error application modal when asked', () => {
    render(
      reactQueryProviderHOC(
        <TestOfferModal
          modalToDisplay={OfferModal.ERROR_APPLICATION}
          offerId={1000}
          from={StepperOrigin.OFFER}
        />
      )
    )

    expect(
      screen.getByText('Tu n’as pas encore obtenu' + LINE_BREAK + 'ton crédit')
    ).toBeOnTheScreen()
  })

  it('should return finish subscription modal when asked', async () => {
    render(
      reactQueryProviderHOC(
        <TestOfferModal
          modalToDisplay={OfferModal.FINISH_SUBSCRIPTION}
          offerId={1000}
          from={StepperOrigin.OFFER}
        />
      )
    )

    expect(
      screen.getByText('Débloque ton crédit' + LINE_BREAK + 'pour réserver cette offre')
    ).toBeOnTheScreen()
  })
})
