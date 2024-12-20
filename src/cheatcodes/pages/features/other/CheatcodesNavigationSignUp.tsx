import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToComponent } from 'cheatcodes/components/LinkToComponent'
import { useSomeOfferId } from 'cheatcodes/hooks/useSomeOfferId'
import { StepperOrigin, UseNavigationType } from 'features/navigation/RootNavigator/types'
import { ApplicationProcessingModal } from 'shared/offer/components/ApplicationProcessingModal/ApplicationProcessingModal'
import { AuthenticationModal } from 'shared/offer/components/AuthenticationModal/AuthenticationModal'
import { ErrorApplicationModal } from 'shared/offer/components/ErrorApplicationModal/ErrorApplicationModal'
import { FinishSubscriptionModal } from 'shared/offer/components/FinishSubscriptionModal/FinishSubscriptionModal'
import { useModal } from 'ui/components/modals/useModal'

export function CheatcodesNavigationSignUp(): React.JSX.Element {
  const { navigate } = useNavigation<UseNavigationType>()
  const offerId = useSomeOfferId()

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
    <CheatcodesTemplateScreen title="SignUp 🎨">
      <LinkToComponent
        title="Account confirmation lien expiré"
        onPress={() =>
          navigate('SignupConfirmationExpiredLink', {
            email: 'john@wick.com',
          })
        }
      />
      <LinkToComponent
        title="Validate Email"
        onPress={() =>
          navigate('AfterSignupEmailValidationBuffer', {
            token: 'whichTokenDoYouWantReally',
            expiration_timestamp: 456789123,
            email: 'john@wick.com',
          })
        }
      />
      <LinkToComponent title="Account Created" onPress={() => navigate('AccountCreated')} />
      <LinkToComponent
        title="BeneficiaryAccountCreated"
        onPress={() => navigate('BeneficiaryAccountCreated')}
      />
      <LinkToComponent
        title={"C'est pour bientôt"}
        onPress={() =>
          navigate('NotYetUnderageEligibility', {
            eligibilityStartDatetime: new Date('2019-12-01T00:00:00Z').toString(),
          })
        }
      />
      <LinkToComponent title="Finish subscription modal" onPress={showFinishSubscriptionModal} />
      <FinishSubscriptionModal
        visible={finishSubscriptionModalVisible}
        hideModal={hideFinishSubscriptionModal}
        from={StepperOrigin.OFFER}
      />
      <LinkToComponent title="Authentication modal from offer" onPress={showAuthenticationModal} />
      <AuthenticationModal
        visible={authenticationModalVisible}
        hideModal={hideAuthenticationModal}
        offerId={offerId}
        from={StepperOrigin.FAVORITE}
      />
      <LinkToComponent
        title="Application Processing Modal"
        onPress={showApplicationProcessingModal}
      />
      <ApplicationProcessingModal
        visible={applicationProcessingModalVisible}
        hideModal={hideApplicationProcessingModal}
        offerId={offerId}
      />
      <LinkToComponent title="Error Application Modal" onPress={showErrorApplicationModal} />
      <ErrorApplicationModal
        visible={errorApplicationModalVisible}
        hideModal={hideErrorApplicationModal}
        offerId={offerId}
      />
    </CheatcodesTemplateScreen>
  )
}
