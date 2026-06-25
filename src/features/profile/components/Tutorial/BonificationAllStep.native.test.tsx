import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { QFBonificationStatus, DisabilityBonificationStatus } from 'api/gen'
import { BonificationType } from 'features/bonification/enums'
import { BonificationRefusedType } from 'features/bonification/types/BonificationRefusedType'
import { BonificationAllStep } from 'features/profile/components/Tutorial/BonificationAllStep'
import { beneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, screen, userEvent } from 'tests/utils'

const resetBannerVisibility = jest.fn()

function renderComponent(userOverrides = {}, propsOverrides = {}) {
  return render(
    <BonificationAllStep
      amount="300 €"
      isLoggedIn
      resetBannerVisibility={resetBannerVisibility}
      user={{
        ...beneficiaryUser,
        qfBonificationStatus: QFBonificationStatus.eligible,
        ...userOverrides,
      }}
      {...propsOverrides}
    />
  )
}

describe('BonificationAllStep', () => {
  beforeEach(() => {
    setFeatureFlags([])
    jest.clearAllMocks()
  })

  describe('Family quotient bonification', () => {
    it('should show QF button when user is eligible', () => {
      renderComponent()

      expect(screen.getByLabelText('Faire une demande de bonus quotient familial')).toBeTruthy()
    })

    it('should navigate to explanations when pressing QF button', async () => {
      renderComponent()

      await userEvent.press(screen.getByLabelText('Faire une demande de bonus quotient familial'))

      expect(navigate).toHaveBeenCalledWith(
        'SubscriptionStackNavigator',
        expect.objectContaining({ screen: 'BonificationExplanations' })
      )

      expect(resetBannerVisibility).toHaveBeenCalledTimes(1)
    })

    it('should navigate to refused screen when too many retries', async () => {
      renderComponent({ remainingBonusAttempts: 0 })

      await userEvent.press(screen.getByLabelText('Faire une demande de bonus quotient familial'))

      expect(navigate).toHaveBeenCalledWith(
        'SubscriptionStackNavigator',
        expect.objectContaining({
          screen: 'BonificationRefused',
          params: { bonificationRefusedType: BonificationRefusedType.TOO_MANY_RETRIES },
        })
      )
    })

    it('should not show QF button when not logged in', () => {
      renderComponent({}, { isLoggedIn: false })

      expect(screen.queryByLabelText('Faire une demande de bonus quotient familial')).toBeNull()
    })

    it('should disable QF button when status is started', () => {
      renderComponent({ qfBonificationStatus: QFBonificationStatus.started })

      const button = screen.getByLabelText('En cours de traitement pour le bonus quotient familial')

      expect(button.props.accessibilityState.disabled).toBe(true)
    })

    it('should disable QF button when feature flag is enabled', () => {
      setFeatureFlags([RemoteStoreFeatureFlags.DISABLE_QF_BONIFICATION_BUTTON])
      renderComponent()

      const button = screen.getByLabelText('Faire une demande de bonus quotient familial')

      expect(button.props.accessibilityState.disabled).toBe(true)
    })
  })

  describe('Disability bonification', () => {
    it('should show disability button when eligible', () => {
      renderComponent()

      expect(screen.getByLabelText('Faire une demande de bonus situation de handicap')).toBeTruthy()
    })

    it('should navigate to disability form', async () => {
      renderComponent()

      await userEvent.press(
        screen.getByLabelText('Faire une demande de bonus situation de handicap')
      )

      expect(navigate).toHaveBeenCalledWith(
        'SubscriptionStackNavigator',
        expect.objectContaining({
          screen: 'BonificationRequiredInformation',
          params: {
            bonificationType: BonificationType.DISABILITY,
          },
        })
      )
    })

    it('should not show disability button when not logged in', () => {
      renderComponent({}, { isLoggedIn: false })

      expect(screen.queryByText('Faire une demande')).toBeNull()
    })

    it('should hide button when granted', () => {
      renderComponent({
        disabilityBonificationStatus: DisabilityBonificationStatus.granted,
      })

      expect(screen.queryByLabelText('Faire une demande de bonus situation de handicap')).toBeNull()
    })

    it('should disable button when started', () => {
      renderComponent({ disabilityBonificationStatus: DisabilityBonificationStatus.started })

      const button = screen.getByLabelText(
        'En cours de traitement pour le bonus situation de handicap'
      )

      expect(button.props.accessibilityState.disabled).toBe(true)
    })

    it('should disable button when feature flag is enabled', () => {
      setFeatureFlags([RemoteStoreFeatureFlags.DISABLE_HANDICAP_BONIFICATION_BUTTON])
      renderComponent()

      const button = screen.getByLabelText('Faire une demande de bonus situation de handicap')

      expect(button.props.accessibilityState.disabled).toBe(true)
    })
  })
})
