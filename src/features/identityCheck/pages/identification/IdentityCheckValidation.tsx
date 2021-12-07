import { t } from '@lingui/macro'
// TODO PC-12075 : remove idCheck imports
import { IdCheckFile, IdCheckRootStackParamList } from '@pass-culture/id-check'
import { UploadButton } from '@pass-culture/id-check/src/components/layout/UploadButton'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import moment from 'moment'
import React from 'react'
import styled from 'styled-components/native'

import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { useIdentityCheckNavigation } from 'features/identityCheck/useIdentityCheckNavigation'
import { useEduconnect } from 'features/identityCheck/utils/useEduConnect'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

interface ValidationProps {
  upload: (file: IdCheckFile) => Promise<void>
}

export const IdentityCheckValidation = ({ upload }: ValidationProps) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { navigate } = useNavigation<StackNavigationProp<IdCheckRootStackParamList>>()

  const { dispatch, identification } = useIdentityCheckContext()
  const { navigateToNextScreen } = useIdentityCheckNavigation()

  const { shouldUseEduConnect } = useEduconnect()
  const birthDate = identification.birthDate
    ? moment(identification.birthDate, 'YYYY-MM-DD').format('DD/MM/YYYY')
    : ''

  const navigateToNextEduConnectStep = async () => {
    dispatch({ type: 'SET_STEP', payload: IdentityCheckStep.CONFIRMATION })
    navigateToNextScreen()
  }

  function onValidate() {
    if (shouldUseEduConnect) {
      navigateToNextEduConnectStep()
    } else {
      navigate(identification.countryCode !== 'OK' ? 'Residence' : 'Success')
    }
  }

  return (
    <PageWithHeader
      title={t`Mon identité`}
      fixedTopChildren={<Title>{t`Les informations extraites sont-elles correctes ?`}</Title>}
      scrollChildren={
        <BodyContainer>
          <Typo.Body color={ColorsEnum.GREY_DARK}>{t`Ton prénom`}</Typo.Body>
          <Spacer.Column numberOfSpaces={2} />
          <Typo.Title3 testID="validation-first-name">{identification.firstName}</Typo.Title3>
          <Spacer.Column numberOfSpaces={5} />
          <Typo.Body color={ColorsEnum.GREY_DARK}>{t`Ton nom de famille`}</Typo.Body>
          <Spacer.Column numberOfSpaces={2} />
          <Typo.Title3 testID="validation-name">{identification.lastName}</Typo.Title3>
          <Spacer.Column numberOfSpaces={5} />
          <Typo.Body color={ColorsEnum.GREY_DARK}>{t`Ta date de naissance`}</Typo.Body>
          <Spacer.Column numberOfSpaces={2} />
          <Typo.Title3 testID="validation-birth-date">{birthDate}</Typo.Title3>
        </BodyContainer>
      }
      fixedBottomChildren={
        <React.Fragment>
          <StyledButtonPrimary title={t`Valider mes informations`} onPress={onValidate} />
          {!shouldUseEduConnect && (
            <React.Fragment>
              <Spacer.Column numberOfSpaces={3} />
              <UploadButton text={t`Réessayer d'ajouter mon document`} upload={upload} grey />
            </React.Fragment>
          )}
        </React.Fragment>
      }
    />
  )
}

const StyledButtonPrimary = styled(ButtonPrimary)({
  width: '100%',
})

const BodyContainer = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
})

const Title = styled(Typo.Title4)({
  textAlign: 'center',
  padding: getSpacing(2.5),
})
