import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { FastEduconnectConnectionRequestModal } from 'features/identityCheck/components/FastEduconnectConnectionRequestModal'
import { NotEligibleEduConnect } from 'features/identityCheck/errors/eduConnect/NotEligibleEduConnect'
import { EduConnectErrorMessageEnum } from 'features/identityCheck/errors/hooks/useNotEligibleEduConnectErrorData'
import {
  RootScreenNames,
  RootStackParamList,
  UseNavigationType,
} from 'features/navigation/RootNavigator'
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

  const trigger = (message: EduConnectErrorMessageEnum) => {
    setScreenError(new ScreenError(message, NotEligibleEduConnect))
  }

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
        <LinkToComponent name="IdentityCheckStepper" wording="Stepper" />
        <LinkToComponent name="IdentityCheckStatus" wording="Status" />
        <LinkToComponent name="IdentityCheckStart" />
        <LinkToComponent name="IdentityCheckUnavailable" />
        <LinkToComponent name="IdentityCheckPending" />
        <LinkToComponent name="SetName" />
        <LinkToComponent name="IdentityCheckAddress" wording="SetAddress" />
        <LinkToComponent name="IdentityCheckCity" wording="SetCity" />
        <LinkToComponent name="IdentityCheckEnd" />
        <LinkToComponent name="IdentityCheckHonor" />
        <LinkToComponent name="IdentityCheckEduConnectForm" />
        <LinkToComponent name="IdentityCheckEduConnect" wording="EduConnect" />
        <LinkToComponent name="IdentityCheckDMS" />
        <LinkToComponent
          name="IdentityCheckValidation"
          navigationParams={{
            firstName: 'firstName',
            lastName: 'lastName',
            dateOfBirth: '2021-12-01',
          }}
        />
        <LinkToComponent
          wording={'UserAgeNotValid Educonnect Error'}
          onPress={() => trigger(EduConnectErrorMessageEnum.UserAgeNotValid)}
        />
        <LinkToComponent
          wording={'UserAgeNotValid18YearsOld Error'}
          onPress={() => trigger(EduConnectErrorMessageEnum.UserAgeNotValid18YearsOld)}
        />
        <LinkToComponent
          wording={'UserTypeNotStudent Error'}
          onPress={() => trigger(EduConnectErrorMessageEnum.UserTypeNotStudent)}
        />

        <LinkToComponent
          wording={'UserNotWhitelisted Error'}
          onPress={() => trigger(EduConnectErrorMessageEnum.UserNotWhitelisted)}
        />
        <LinkToComponent
          wording={'Generic Error'}
          onPress={() => trigger(EduConnectErrorMessageEnum.GenericError)}
        />
        <Row half>
          <NavigationButton
            wording={'Identifie-toi en 2 minutes'}
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
  name?: RootScreenNames
  onPress?: () => void
  wording?: string
  navigationParams?: RootStackParamList[RootScreenNames]
}

const LinkToComponent = ({
  name = 'NavigationIdentityCheck',
  onPress,
  wording,
  navigationParams,
}: LinkToComponentProps) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const navigateToComponent = () => navigate(name, navigationParams)

  return (
    <Row half>
      <NavigationButton wording={wording ?? name} onPress={onPress ?? navigateToComponent} />
    </Row>
  )
}

const NavigationButton = styled(ButtonPrimary).attrs({
  textSize: 11.5, // TODO: fix me because this will not work as the textSize was removed, either pass a title props with custom textSize or use an existing button with small text size
})``

const StyledContainer = styled.View({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
})

const Row = styled.View<{ half?: boolean }>(({ half = false }) => ({
  width: half ? '50%' : '100%',
  ...padding(2, 0.5),
}))
