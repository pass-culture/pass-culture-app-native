import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { NotEligibleEduConnect } from 'features/identityCheck/errors/eduConnect/NotEligibleEduConnect'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useGoBack } from 'features/navigation/useGoBack'
import { ScreenError } from 'libs/monitoring/errors'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { padding, Spacer } from 'ui/theme'

export function NavigationIdentityCheck(): JSX.Element {
  const { navigate } = useNavigation<UseNavigationType>()
  const { goBack } = useGoBack('Navigation', undefined)
  const [screenError, setScreenError] = useState<ScreenError | undefined>(undefined)

  if (screenError) throw screenError

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
          <NavigationButton title={'SetAddress'} onPress={() => navigate('IdentityCheckAddress')} />
        </Row>
        <Row half>
          <NavigationButton
            title={'SetCity'}
            onPress={() => navigate('IdentityCheckCity')}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'IdentityCheckEnd'}
            onPress={() => navigate('IdentityCheckEnd')}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'IdentityCheckHonor'}
            onPress={() => navigate('IdentityCheckHonor')}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'Ineligible Educonnect Error'}
            onPress={() => {
              setScreenError(new ScreenError('UserAgeNotValidEduConnect', NotEligibleEduConnect))
            }}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'InvalidAgeFromEduConnect Error'}
            onPress={() => {
              setScreenError(
                new ScreenError('InvalidAgeFromEduConnectEduConnect', NotEligibleEduConnect)
              )
            }}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'InvalidInformationEduConnect Error'}
            onPress={() => {
              setScreenError(new ScreenError('InvalidInformationEduConnect', NotEligibleEduConnect))
            }}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'LegalRepresentative Error'}
            onPress={() => {
              setScreenError(
                new ScreenError('LegalRepresentativeEduConnect', NotEligibleEduConnect)
              )
            }}
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
