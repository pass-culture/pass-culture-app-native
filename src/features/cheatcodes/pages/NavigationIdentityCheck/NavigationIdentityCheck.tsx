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
        <LinkToComponent name="IdentityCheckSchoolType" title="SchoolType" />
        <LinkToComponent name="IdentityCheckStart" />
        <LinkToComponent name="IdentityCheckUnavailable" />
        <LinkToComponent name="IdentityCheckPending" />
        <LinkToComponent name="SetName" />
        <LinkToComponent name="IdentityCheckAddress" title="SetAddress" />
        <LinkToComponent name="IdentityCheckCity" title="SetCity" />
        <LinkToComponent name="IdentityCheckEnd" />
        <LinkToComponent name="IdentityCheckHonor" />
        <LinkToComponent name="IdentityCheckEduConnectForm" />
        <LinkToComponent name="IdentityCheckEduConnect" title={'EduConnect'} />
        <LinkToComponent
          name="IdentityCheckValidation"
          navigationParams={{
            firstName: 'firstName',
            lastName: 'lastName',
            dateOfBirth: '2021-12-01',
          }}
        />
        <Row half>
          <NavigationButton
            title={'UserAgeNotValid Educonnect Error'}
            onPress={() => {
              setScreenError(
                new ScreenError(EduConnectErrorMessageEnum.UserAgeNotValid, NotEligibleEduConnect)
              )
            }}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'UserAgeNotValid18YearsOld Error'}
            onPress={() => {
              setScreenError(
                new ScreenError(
                  EduConnectErrorMessageEnum.UserAgeNotValid18YearsOld,
                  NotEligibleEduConnect
                )
              )
            }}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'UserTypeNotStudent Error'}
            onPress={() => {
              setScreenError(
                new ScreenError(
                  EduConnectErrorMessageEnum.UserTypeNotStudent,
                  NotEligibleEduConnect
                )
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
  navigationParams?: RootStackParamList[RootScreenNames]
}

const LinkToComponent = ({ name, onPress, title, navigationParams }: LinkToComponentProps) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const navigateToComponent = () => navigate(name, navigationParams)

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
