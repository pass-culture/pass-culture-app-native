import React from 'react'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToCheatcodesScreen } from 'cheatcodes/components/LinkToCheatcodesScreen'
import { useSomeOfferIdQuery } from 'cheatcodes/queries/useSomeOfferIdQuery'
import { CheatcodesButtonsWithSubscreensProps } from 'cheatcodes/types'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { ApplicationProcessingModal } from 'shared/offer/components/ApplicationProcessingModal/ApplicationProcessingModal'
import { AuthenticationModal } from 'shared/offer/components/AuthenticationModal/AuthenticationModal'
import { ErrorApplicationModal } from 'shared/offer/components/ErrorApplicationModal/ErrorApplicationModal'
import { FinishSubscriptionModal } from 'shared/offer/components/FinishSubscriptionModal/FinishSubscriptionModal'
import { useModal } from 'ui/components/modals/useModal'

export const cheatcodesNavigationSignUpButtons: [CheatcodesButtonsWithSubscreensProps] = [
  {
    title: 'SignUp 🎨',
    screen: 'CheatcodesStackNavigator',
    navigationParams: { screen: 'CheatcodesNavigationSignUp' },
    subscreens: [
      { title: 'FinishSubscriptionModal', showOnlyInSearch: true },
      { title: 'AuthenticationModal', showOnlyInSearch: true },
      { title: 'ApplicationProcessingModal', showOnlyInSearch: true },
      { title: 'ErrorApplicationModal', showOnlyInSearch: true },
      { screen: 'AccountCreated' },
      { screen: 'BeneficiaryAccountCreated' },
      { screen: 'SignupConfirmationExpiredLink', navigationParams: { email: 'john@wick.com' } },
      {
        screen: 'NotYetUnderageEligibility',
        navigationParams: {
          eligibilityStartDatetime: new Date('2019-12-01T00:00:00Z').toString(),
        },
      },
      {
        screen: 'AfterSignupEmailValidationBuffer',
        navigationParams: {
          token: 'whichTokenDoYouWantReally',
          expiration_timestamp: 456789123,
          email: 'john@wick.com',
        },
      },
    ],
  },
]

export function CheatcodesNavigationSignUp(): React.JSX.Element {
  const offerId = useSomeOfferIdQuery()

  const {
    visible: finishSubscriptionModalVisible,
    showModal: showFinishSubscriptionModal,
    hideModal: hideFinishSubscriptionModal,
  } = useModal(false)

  const {
    visible: authenticationModalVisible,
    showModal: showAuthenticationModal,
    hideModal: hideAuthenticationModal,
  } = useModal(false)

  const {
    visible: applicationProcessingModalVisible,
    showModal: showApplicationProcessingModal,
    hideModal: hideApplicationProcessingModal,
  } = useModal(false)

  const {
    visible: errorApplicationModalVisible,
    showModal: showErrorApplicationModal,
    hideModal: hideErrorApplicationModal,
  } = useModal(false)

  return (
    <CheatcodesTemplateScreen title={cheatcodesNavigationSignUpButtons[0].title}>
      <CheatcodesSubscreensButtonList buttons={cheatcodesNavigationSignUpButtons} />

      <LinkToCheatcodesScreen
        title="FinishSubscriptionModal"
        onPress={showFinishSubscriptionModal}
      />
      <FinishSubscriptionModal
        visible={finishSubscriptionModalVisible}
        hideModal={hideFinishSubscriptionModal}
        from={StepperOrigin.OFFER}
      />

      <LinkToCheatcodesScreen title="AuthenticationModal" onPress={showAuthenticationModal} />
      <AuthenticationModal
        visible={authenticationModalVisible}
        hideModal={hideAuthenticationModal}
        offerId={offerId}
        from={StepperOrigin.FAVORITE}
      />

      <LinkToCheatcodesScreen
        title="ApplicationProcessingModal"
        onPress={showApplicationProcessingModal}
      />
      <ApplicationProcessingModal
        visible={applicationProcessingModalVisible}
        hideModal={hideApplicationProcessingModal}
        offerId={offerId}
      />

      <LinkToCheatcodesScreen title="ErrorApplicationModal" onPress={showErrorApplicationModal} />
      <ErrorApplicationModal
        visible={errorApplicationModalVisible}
        hideModal={hideErrorApplicationModal}
        offerId={offerId}
      />
    </CheatcodesTemplateScreen>
  )
}
