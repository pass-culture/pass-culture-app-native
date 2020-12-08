import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent, useState } from 'react'
import styled from 'styled-components/native'

import { RootStackParamList, UseNavigationType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import { BottomCardContentContainer } from 'ui/components/BottomCard'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { DateInput } from 'ui/components/inputs/DateInput'
import { InputError } from 'ui/components/inputs/InputError'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { useModal } from 'ui/components/modals/useModal'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { BirthdayCake } from 'ui/svg/icons/BirthdayCake'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing, Spacer, Typo } from 'ui/theme'

interface State {
  date: string | null
  hasError: boolean
  isComplete: boolean
}

type Props = StackScreenProps<RootStackParamList, 'SetBirthday'>

export const SetBirthday: FunctionComponent<Props> = ({ route }) => {
  const [state, setState] = useState<State>({
    date: '',
    hasError: false,
    isComplete: false,
  })

  const {
    visible: informationModalVisible,
    showModal: showInformationModal,
    hideModal: hideInformationModal,
  } = useModal(false)

  const { goBack, navigate } = useNavigation<UseNavigationType>()
  const email = route.params.email
  const isNewsletterChecked = route.params.isNewsletterChecked
  const password = route.params.password

  function onChangeValue(value: string | null, isComplete: boolean) {
    setState({
      date: value,
      isComplete,
      hasError: isComplete && value === null,
    })
  }

  function goToCguAcceptance() {
    navigate('AcceptCgu', {
      email: email,
      isNewsletterChecked: isNewsletterChecked,
      password: password,
      birthday: state.date ? state.date : '',
    })
  }

  return (
    <React.Fragment>
      <BottomContentPage>
        <ModalHeader
          title={_(t`Ton anniversaire`)}
          leftIcon={ArrowPrevious}
          onLeftIconPress={goBack}
          rightIcon={Close}
        />
        <BottomCardContentContainer>
          <ButtonTertiary
            title={_(t`Pourquoi ?`)}
            onPress={showInformationModal}
            testIdSuffix={'why-link'}
          />
          <DateInputContainer>
            <DateInput onChangeValue={onChangeValue} />
            <InputError
              visible={state.hasError}
              messageId="La date choisie est incorrecte"
              numberOfSpacesTop={5}
            />
          </DateInputContainer>
          <ButtonPrimary
            title={_(t`Continuer`)}
            disabled={!state.isComplete}
            testIdSuffix={'validate-birthday'}
            onPress={goToCguAcceptance}
          />
        </BottomCardContentContainer>
      </BottomContentPage>
      <AppInformationModal
        title="Pourquoi ?"
        visible={informationModalVisible}
        onCloseIconPress={hideInformationModal}
        testIdSuffix="birthday-information">
        <React.Fragment>
          <BirthdayCake />
          <Spacer.Column numberOfSpaces={2} />
          <StyledBody>
            {_(t`L’application pass Culture est accessible à tous.
         Si tu as 18 ans, tu es éligible pour obtenir une aide financière de 300 €
          proposée par le Ministère de la Culture qui sera créditée directement sur ton compte pass Culture.`)}
          </StyledBody>
        </React.Fragment>
      </AppInformationModal>
    </React.Fragment>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})

const DateInputContainer = styled.View({
  marginVertical: getSpacing(10),
  alignItems: 'center',
  width: '100%',
})
