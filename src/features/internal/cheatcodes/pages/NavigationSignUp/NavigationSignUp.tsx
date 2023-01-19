import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { LinkToComponent } from 'features/internal/cheatcodes/components/LinkToComponent'
import { Row } from 'features/internal/cheatcodes/components/Row'
import { useSomeOfferId } from 'features/internal/cheatcodes/hooks/useSomeOfferId'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { ApplicationProcessingModal } from 'features/offer/components/ApplicationProcessingModal/ApplicationProcessingModal'
import { AuthenticationModal } from 'features/offer/components/AuthenticationModal/AuthenticationModal'
import { ErrorApplicationModal } from 'features/offer/components/ErrorApplicationModal/ErrorApplicationModal'
import { FinishSubscriptionModal } from 'features/offer/components/FinishSubscriptionModal/FinishSubscriptionModal'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { useModal } from 'ui/components/modals/useModal'
import { Spacer } from 'ui/theme'

export function NavigationSignUp(): JSX.Element {
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
    <ScrollView>
      <PageHeaderSecondary title="SignUp 🎨" />
      <StyledContainer>
        <LinkToComponent
          title={'IdentityCheck 🎨'}
          onPress={() => navigate('NavigationIdentityCheck')}
        />
        <LinkToComponent
          title={'NewIdentificationFlow 🎨'}
          onPress={() => navigate('NewIdentificationFlow')}
        />
        <LinkToComponent
          title={'Email envoyé'}
          onPress={() =>
            navigate('SignupConfirmationEmailSent', {
              email: 'jean.dupont@gmail.com',
            })
          }
        />
        <LinkToComponent
          title={'Account confirmation lien expiré'}
          onPress={() =>
            navigate('SignupConfirmationExpiredLink', {
              email: 'john@wick.com',
            })
          }
        />
        <LinkToComponent
          title={'Validate Email'}
          onPress={() =>
            navigate('AfterSignupEmailValidationBuffer', {
              token: 'whichTokenDoYouWantReally',
              expiration_timestamp: 456789123,
              email: 'john@wick.com',
            })
          }
        />
        <LinkToComponent title={'Account Created'} onPress={() => navigate('AccountCreated')} />
        <LinkToComponent
          title={'BeneficiaryAccountCreated'}
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
        <Row half>
          <ButtonPrimary
            wording="Finish subscription modal"
            onPress={showFinishSubscriptionModal}
          />
          <FinishSubscriptionModal
            visible={finishSubscriptionModalVisible}
            hideModal={hideFinishSubscriptionModal}
            offerId={offerId}
          />
        </Row>
        <Row half>
          <ButtonPrimary
            wording="Authentication modal from offer"
            onPress={showAuthenticationModal}
          />
          <AuthenticationModal
            visible={authenticationModalVisible}
            hideModal={hideAuthenticationModal}
            offerId={offerId}
          />
        </Row>
        <Row half>
          <ButtonPrimary
            wording="Application Processing Modal"
            onPress={showApplicationProcessingModal}
          />
          <ApplicationProcessingModal
            visible={applicationProcessingModalVisible}
            hideModal={hideApplicationProcessingModal}
            offerId={offerId}
          />
        </Row>
        <Row half>
          <ButtonPrimary wording="Error Application Modal" onPress={showErrorApplicationModal} />
          <ErrorApplicationModal
            visible={errorApplicationModalVisible}
            hideModal={hideErrorApplicationModal}
            offerId={offerId}
          />
        </Row>
      </StyledContainer>
      <Spacer.BottomScreen />
    </ScrollView>
  )
}

const StyledContainer = styled.View({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
})
