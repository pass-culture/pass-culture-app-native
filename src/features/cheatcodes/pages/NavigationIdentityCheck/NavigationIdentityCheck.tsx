import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useGoBack } from 'features/navigation/useGoBack'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { padding, Spacer } from 'ui/theme'

export function NavigationIdentityCheck(): JSX.Element {
  const { navigate } = useNavigation<UseNavigationType>()
  const { goBack } = useGoBack('Navigation', undefined)

  return (
    <ScrollView>
      <Spacer.TopScreen />
      <ModalHeader
        title="New IdentityCheck 🎨"
        leftIconAccessibilityLabel={`Revenir en arrière`}
        leftIcon={ArrowPrevious}
        onLeftIconPress={goBack}
        rightIconAccessibilityLabel={undefined}
        rightIcon={undefined}
        onRightIconPress={undefined}
      />
      <StyledContainer>
        <Row half>
          <NavigationButton title={'Stepper'} onPress={() => navigate('IdentityCheck')} />
        </Row>
        <Row half>
          <NavigationButton title={'Status'} onPress={() => navigate('IdentityCheckStatus')} />
        </Row>
        <Row half>
          <NavigationButton
            title={'IdentityCheckStart'}
            onPress={() => navigate('IdentityCheckStart')}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'SetName'}
            onPress={() =>
              navigate('SetName', {
                email: 'jonh.doe@exmaple.com',
                isNewsletterChecked: false,
              })
            }
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'SetPostalCode'}
            onPress={() => navigate('IdentityCheckPostalCode')}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'IdentityCheckEnd'}
            onPress={() => navigate('IdentityCheckEnd')}
          />
        </Row>
      </StyledContainer>
      <Spacer.BottomScreen />
    </ScrollView>
  )
}

const NavigationButton = styled(ButtonPrimary).attrs({
  textSize: 11.5,
})({})

const StyledContainer = styled.View({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
})

const Row = styled.View<{ half?: boolean }>(({ half = false }) => ({
  width: half ? '50%' : '100%',
  ...padding(2, 0.5),
}))
