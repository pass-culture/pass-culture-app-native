import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { FastEduconnectConnectionRequestModal } from 'features/identityCheck/components/FastEduconnectConnectionRequestModal'
import { NotEligibleEduConnect } from 'features/identityCheck/errors/eduConnect/NotEligibleEduConnect'
import { RootScreenNames, UseNavigationType } from 'features/navigation/RootNavigator'
import { useGoBack } from 'features/navigation/useGoBack'
import { ScreenError } from 'libs/monitoring/errors'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { padding, Spacer } from 'ui/theme'

export function NavigationIdentityCheck(): JSX.Element {
  const { goBack } = useGoBack('Navigation', undefined)
  const [screenError, setScreenError] = useState<ScreenError | undefined>(undefined)
  const [
    fastEduconnectConnectionRequestModalVisible,
    setFastEduconnectConnectionRequestModalVisible,
  ] = useState(false)

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
        <LinkToComponent name="IdentityCheck" title="Stepper" />
        <LinkToComponent name="IdentityCheckStatus" title="Status" />
        <LinkToComponent name="IdentityCheckStart" />
        <LinkToComponent name="SetName" />
        <LinkToComponent name="IdentityCheckAddress" title="SetAddress" />
        <LinkToComponent name="IdentityCheckCity" title="SetCity" />
        <LinkToComponent name="IdentityCheckEnd" />
        <LinkToComponent name="IdentityCheckHonor" />
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
        <Row half>
          <NavigationButton
            title={'Identifie-toi en 2 minutes'}
            onPress={() => {
              setFastEduconnectConnectionRequestModalVisible(true)
            }}
          />
        </Row>
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
  name: RootScreenNames
  onPress?: () => void
  title?: string
}

const LinkToComponent = ({ name, onPress, title }: LinkToComponentProps) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const navigateToComponent = () => navigate(name)

  return (
    <Row half>
      <NavigationButton title={title ?? name} onPress={onPress ?? navigateToComponent} />
    </Row>
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
