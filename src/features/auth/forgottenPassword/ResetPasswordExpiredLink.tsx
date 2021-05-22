import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { useQuery } from 'react-query'
import styled from 'styled-components/native'

import { api } from 'api/api'
import { openExternalUrl } from 'features/navigation/helpers'
import { navigateToHome } from 'features/navigation/helpers'
import { RootStackParamList, UseNavigationType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { AsyncError } from 'libs/errorMonitoring'
import { QueryKeys } from 'libs/queryKeys'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { SadFace } from 'ui/svg/icons/SadFace'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

type Props = StackScreenProps<RootStackParamList, 'ResetPasswordExpiredLink'>

export function ResetPasswordExpiredLink(props: Props) {
  const { navigate } = useNavigation<UseNavigationType>()
  const { refetch: resetPasswordEmailQuery, isFetching } = useQuery(
    QueryKeys.RESET_PASSWORD_EXPIRED_LINK,
    resetPasswordExpiredLink,
    {
      cacheTime: 0,
      enabled: false,
    }
  )

  async function resetPasswordExpiredLink() {
    try {
      const { email } = props.route.params
      analytics.logResendEmailResetPasswordExpiredLink()
      await api.postnativev1requestPasswordReset({ email })
      navigate('ResetPasswordEmailSent', { email })
    } catch (_err) {
      throw new AsyncError('NETWORK_REQUEST_FAILED', resetPasswordEmailQuery)
    }
  }

  return (
    <GenericInfoPage title={t`Oups`} icon={SadFace}>
      <StyledBody>{t`Le lien est expiré !`}</StyledBody>
      <StyledBody>{t`Clique sur « Renvoyer l’e-mail » pour recevoir un nouveau lien.`}</StyledBody>
      <Spacer.Column numberOfSpaces={4} />
      <StyledBody>{t`Si tu as besoin d’aide n’hésite pas à :`}</StyledBody>
      <Spacer.Column numberOfSpaces={4} />
      <ButtonTertiaryWhite
        title={t`Consulter l'article d'aide`}
        onPress={() =>
          openExternalUrl(
            'https://aide.passculture.app/fr/articles/5261997-je-n-ai-pas-recu-le-mail-de-confirmation-de-changement-de-mot-de-passe'
          )
        }
        icon={ExternalSite}
      />
      <Spacer.Column numberOfSpaces={4} />
      <ButtonPrimaryWhite
        title={t`Renvoyer l'email`}
        onPress={() => resetPasswordEmailQuery()}
        disabled={isFetching}
      />
      <Spacer.Column numberOfSpaces={4} />
      <ButtonTertiaryWhite title={t`Retourner à l'accueil`} onPress={navigateToHome} />
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})
