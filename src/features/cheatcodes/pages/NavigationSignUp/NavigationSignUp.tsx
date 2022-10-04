import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { LinkToComponent } from 'features/cheatcodes/components/LinkToComponent'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { Spacer } from 'ui/theme'

export function NavigationSignUp(): JSX.Element {
  const { navigate } = useNavigation<UseNavigationType>()

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
