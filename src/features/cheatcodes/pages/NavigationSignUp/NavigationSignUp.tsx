import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { FastEduconnectConnectionRequestModal } from 'features/identityCheck/components/FastEduconnectConnectionRequestModal'
import {
  RootScreenNames,
  RootStackParamList,
  UseNavigationType,
} from 'features/navigation/RootNavigator'
import { useGoBack } from 'features/navigation/useGoBack'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { padding, Spacer } from 'ui/theme'

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

interface LinkToComponentProps {
  name?: RootScreenNames
  onPress?: () => void
  title?: string
  navigationParams?: RootStackParamList[RootScreenNames]
}

const LinkToComponent = ({
  name = 'NavigationSignUp',
  onPress,
  title,
  navigationParams,
}: LinkToComponentProps) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const navigateToComponent = () => navigate(name, navigationParams)

  return (
    <Row half>
      <ButtonPrimary wording={title ?? name} onPress={onPress ?? navigateToComponent} />
    </Row>
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
