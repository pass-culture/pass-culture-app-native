import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { LinkToComponent } from 'features/cheatcodes/components/LinkToComponent'
import { Row } from 'features/cheatcodes/components/Row'
import { FastEduconnectConnectionRequestModal } from 'features/identityCheck/components/FastEduconnectConnectionRequestModal'
import { NotEligibleEduConnect } from 'features/identityCheck/pages/identification/errors/eduConnect/NotEligibleEduConnect'
import { EduConnectErrorMessageEnum } from 'features/identityCheck/pages/identification/errors/hooks/useNotEligibleEduConnectErrorData'
import { PhoneValidationTipsModal } from 'features/identityCheck/pages/phoneValidation/PhoneValidationTipsModal'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useGoBack } from 'features/navigation/useGoBack'
import { ScreenError } from 'libs/monitoring/errors'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { Spacer } from 'ui/theme'

export function NavigationIdentityCheck(): JSX.Element {
  const { goBack } = useGoBack('Navigation', undefined)
  const [screenError, setScreenError] = useState<ScreenError | undefined>(undefined)
  const [
    fastEduconnectConnectionRequestModalVisible,
    setFastEduconnectConnectionRequestModalVisible,
  ] = useState(false)
  const [phoneValidationTipsModalVisible, setPhoneValidationTipsModalVisible] = useState(false)
  const { navigate } = useNavigation<UseNavigationType>()

  const trigger = (message: EduConnectErrorMessageEnum) => {
    setScreenError(new ScreenError(message, NotEligibleEduConnect))
  }

  if (screenError) throw screenError

  return (
    <ScrollView>
      <Spacer.TopScreen />
      <PageHeader title="IdentityCheck 🎨" withGoBackButton position="absolute" />
      <StyledContainer>
        <LinkToComponent name="IdentityCheckStepper" title="Stepper" />
        <LinkToComponent
          title={`Too many codes`}
          onPress={() => navigate('PhoneValidationTooManyAttempts')}
        />
        <LinkToComponent
          title={`Too many SMS sent`}
          onPress={() => navigate('PhoneValidationTooManySMSSent')}
        />

        <LinkToComponent name="SetPhoneNumber" title="new SetPhoneNumber" />
        <LinkToComponent
          title={'PhoneValidation tips Modal'}
          onPress={() => setPhoneValidationTipsModalVisible(true)}
        />
        <LinkToComponent
          title={'New SetPhoneValidationCode'}
          onPress={() => navigate('SetPhoneValidationCode')}
        />
        <LinkToComponent name="IdentityCheckStatus" title="SetStatus" />
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
          title={'UserAgeNotValid Educonnect Error'}
          onPress={() => trigger(EduConnectErrorMessageEnum.UserAgeNotValid)}
        />
        <LinkToComponent
          title={'UserAgeNotValid18YearsOld Error'}
          onPress={() => trigger(EduConnectErrorMessageEnum.UserAgeNotValid18YearsOld)}
        />
        <LinkToComponent
          title={'UserTypeNotStudent Error'}
          onPress={() => trigger(EduConnectErrorMessageEnum.UserTypeNotStudent)}
        />
        <LinkToComponent
          title={'DuplicateUser Error'}
          onPress={() => trigger(EduConnectErrorMessageEnum.DuplicateUser)}
        />

        <LinkToComponent
          title={'Generic Error'}
          onPress={() => trigger(EduConnectErrorMessageEnum.GenericError)}
        />
        <Row half>
          <ButtonPrimary
            wording={'Identifie-toi en 2 minutes'}
            onPress={() => {
              setFastEduconnectConnectionRequestModalVisible(true)
            }}
          />
        </Row>
        <Row half>
          <ButtonPrimary
            wording={'VerifyEligibility'}
            onPress={() => navigate('VerifyEligibility')}
          />
        </Row>
        <Row half>
          <ButtonPrimary
            wording="Beneficiary request sent"
            onPress={() => navigate('BeneficiaryRequestSent')}
          />
        </Row>
      </StyledContainer>
      <Spacer.BottomScreen />
      <FastEduconnectConnectionRequestModal
        visible={fastEduconnectConnectionRequestModalVisible}
        hideModal={() => setFastEduconnectConnectionRequestModalVisible(false)}
      />
      <PhoneValidationTipsModal
        isVisible={phoneValidationTipsModalVisible}
        dismissModal={() => setPhoneValidationTipsModalVisible(false)}
        onGoBack={goBack}
      />
    </ScrollView>
  )
}

const StyledContainer = styled.View({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
})
