import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { LinkToComponent } from 'features/cheatcodes/components/LinkToComponent'
import { FastEduconnectConnectionRequestModal } from 'features/identityCheck/components/FastEduconnectConnectionRequestModal'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useGoBack } from 'features/navigation/useGoBack'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Spacer } from 'ui/theme'

export function NavigationSignUp(): JSX.Element {
  const { goBack } = useGoBack('Navigation', undefined)
  const [
    fastEduconnectConnectionRequestModalVisible,
    setFastEduconnectConnectionRequestModalVisible,
  ] = useState(false)
  const { navigate } = useNavigation<UseNavigationType>()

  return (
    <ScrollView>
      <Spacer.TopScreen />
      <ModalHeader
        title="SignUp 🎨"
        leftIconAccessibilityLabel={`Revenir en arrière`}
        leftIcon={ArrowPrevious}
        onLeftIconPress={goBack}
        rightIconAccessibilityLabel={undefined}
        rightIcon={undefined}
        onRightIconPress={undefined}
      />
      <StyledContainer>
        <LinkToComponent
          title={'IdentityCheck 🎨'}
          onPress={() => navigate('NavigationIdentityCheck')}
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
          title={"C'est pour bientôt"}
          onPress={() =>
            navigate('NotYetUnderageEligibility', {
              eligibilityStartDatetime: new Date('2019-12-01T00:00:00Z').toString(),
            })
          }
        />
      </StyledContainer>
      <Spacer.BottomScreen />
      <FastEduconnectConnectionRequestModal
        visible={fastEduconnectConnectionRequestModalVisible}
        hideModal={() => setFastEduconnectConnectionRequestModalVisible(false)}
      />
    </ScrollView>
  )
}

const StyledContainer = styled.View({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
})
