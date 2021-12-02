import { t } from '@lingui/macro'
import {
  IdCheckFile,
  IdCheckRootStackParamList,
  LocalStorageService,
  useEduConnect,
  useInitialRouteName,
  UseRouteType,
} from '@pass-culture/id-check'
import { UploadButton } from '@pass-culture/id-check/src/components/layout/UploadButton'
import { useNavigation, useRoute } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import moment from 'moment'
import React from 'react'
import styled from 'styled-components/native'

import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

interface ValidationProps {
  firstName: string
  name: string
  birthDate: string
  upload: (file: IdCheckFile) => Promise<void>
  countryCode: string
}

export const IdentityCheckValidation = ({
  firstName,
  name,
  birthDate,
  upload,
  countryCode,
}: ValidationProps) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { navigate } = useNavigation<StackNavigationProp<IdCheckRootStackParamList>>()
  const initialRouteName = useInitialRouteName()

  const { params } = useRoute<UseRouteType<'Validation'>>()
  const shouldUseEduConnect = useEduConnect()
  const paramsBirthDate = params?.dateOfBirth
    ? moment(params.dateOfBirth, 'YYYY-MM-DD').format('DD/MM/YYYY')
    : ''

  const navigateToNextEduConnectStep = async () => {
    await LocalStorageService.setCurrentUserStep('beneficiary-information')
    navigate(initialRouteName)
  }

  function onValidate() {
    if (shouldUseEduConnect) {
      navigateToNextEduConnectStep()
    } else {
      navigate(countryCode !== 'OK' ? 'Residence' : 'Success')
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
          <Typo.Title3 testID="validation-first-name">{firstName ?? params?.firstName}</Typo.Title3>
          <Spacer.Column numberOfSpaces={5} />
          <Typo.Body color={ColorsEnum.GREY_DARK}>{t`Ton nom de famille`}</Typo.Body>
          <Spacer.Column numberOfSpaces={2} />
          <Typo.Title3 testID="validation-name">{name ?? params.lastName}</Typo.Title3>
          <Spacer.Column numberOfSpaces={5} />
          <Typo.Body color={ColorsEnum.GREY_DARK}>{t`Ta date de naissance`}</Typo.Body>
          <Spacer.Column numberOfSpaces={2} />
          <Typo.Title3 testID="validation-birth-date">{birthDate ?? paramsBirthDate}</Typo.Title3>
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
