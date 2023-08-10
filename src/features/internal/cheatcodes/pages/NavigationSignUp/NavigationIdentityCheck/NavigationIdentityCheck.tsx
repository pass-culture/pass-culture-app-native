import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { NotEligibleEduConnect } from 'features/identityCheck/pages/identification/errors/eduConnect/NotEligibleEduConnect'
import { EduConnectErrorMessageEnum } from 'features/identityCheck/pages/identification/errors/hooks/useNotEligibleEduConnectErrorData'
import { PhoneValidationTipsModal } from 'features/identityCheck/pages/phoneValidation/PhoneValidationTipsModal'
import { LinkToComponent } from 'features/internal/cheatcodes/components/LinkToComponent'
import { Row } from 'features/internal/cheatcodes/components/Row'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { useGoBack } from 'features/navigation/useGoBack'
import { ScreenError } from 'libs/monitoring/errors'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { Spacer } from 'ui/theme'

export function NavigationIdentityCheck(): React.JSX.Element {
  const { goBack } = useGoBack('Navigation', undefined)
  const [screenError, setScreenError] = useState<ScreenError | undefined>(undefined)
  const [phoneValidationTipsModalVisible, setPhoneValidationTipsModalVisible] = useState(false)
  const { navigate } = useNavigation<UseNavigationType>()

  const trigger = (message: EduConnectErrorMessageEnum) => {
    setScreenError(new ScreenError(message, { Screen: NotEligibleEduConnect }))
  }

  if (screenError) throw screenError

  return (
    <ScrollView>
      <PageHeaderSecondary title="IdentityCheck 🎨" />
      <StyledContainer>
        <LinkToComponent name="Stepper" title="Stepper" />
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
        <LinkToComponent name="SetStatus" title="SetStatus" />
        <LinkToComponent name="IdentityCheckUnavailable" />
        <LinkToComponent name="IdentityCheckPending" />
        <LinkToComponent name="SetName" />
        <LinkToComponent name="SetAddress" title="SetAddress" />
        <LinkToComponent name="SetCity" title="SetCity" />
        <LinkToComponent name="IdentityCheckEnd" />
        <LinkToComponent name="IdentityCheckHonor" />
        <LinkToComponent name="EduConnectForm" />
        <LinkToComponent name="IdentityCheckDMS" />
        <LinkToComponent
          name="EduConnectValidation"
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
        <LinkToComponent name="IdentificationFork" />
      </StyledContainer>
      <Spacer.BottomScreen />
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
