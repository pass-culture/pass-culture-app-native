import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { FinishSubscriptionModal } from 'features/auth/signup/FinishSubscriptionModal/FinishSubscriptionModal'
import { LinkToComponent } from 'features/cheatcodes/components/LinkToComponent'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { AuthenticationModal } from 'features/offer/components/AuthenticationModal'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { useModal } from 'ui/components/modals/useModal'
import { padding, Spacer } from 'ui/theme'

export function NavigationSignUp(): JSX.Element {
  const { navigate } = useNavigation<UseNavigationType>()
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

  return (
    <ScrollView>
      <PageHeader title="SignUp 🎨" position="absolute" withGoBackButton />
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

const Row = styled.View<{ half?: boolean }>(({ half = false }) => ({
  width: half ? '50%' : '100%',
  ...padding(2, 0.5),
}))
