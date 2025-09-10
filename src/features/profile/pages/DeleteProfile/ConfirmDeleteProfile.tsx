import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { useAccountSuspendMutation } from 'features/auth/queries/useAccountSuspendMutation'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { BulletListItem } from 'ui/components/BulletListItem'
import { LinkInsideText } from 'ui/components/buttons/linkInsideText/LinkInsideText'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { VerticalUl } from 'ui/components/Ul'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { ErrorIllustration } from 'ui/svg/icons/ErrorIllustration'
import { getSpacing, Typo } from 'ui/theme'
import { LINE_BREAK } from 'ui/theme/constants'

export function ConfirmDeleteProfile() {
  const { reset } = useNavigation<UseNavigationType>()
  const { showErrorSnackBar } = useSnackBarContext()

  const { suspendAccount, isLoading } = useAccountSuspendMutation({
    onSuccess: () => {
      reset({
        index: 0,
        routes: [
          {
            name: 'TabNavigator',
            state: {
              routes: [
                {
                  name: 'ProfileStackNavigator',
                  state: { routes: [{ name: 'DeactivateProfileSuccess' }] },
                },
              ],
            },
          },
        ],
      })
    },
    onError: () => {
      showErrorSnackBar({
        message: 'Une erreur s’est produite pendant le chargement.',
        timeout: SNACK_BAR_TIME_OUT,
      })
    },
  })

  return (
    <GenericInfoPage
      withGoBack
      illustration={ErrorIllustration}
      title="Veux-tu vraiment supprimer ton compte&nbsp;?"
      buttonPrimary={{
        wording: 'Supprimer mon compte',
        isLoading: isLoading,
        onPress: suspendAccount,
      }}
      buttonTertiary={{
        wording: 'Consulter l’article d’aide',
        externalNav: { url: env.FAQ_LINK_DELETE_ACCOUNT },
        onBeforeNavigate: analytics.logConsultArticleAccountDeletion,
      }}>
      <Typo.BodyAccent>Les conséquences&nbsp;:</Typo.BodyAccent>
      <VerticalUl>
        <BulletListItem text="tes réservations sont annulées sauf pour certains cas précisés dans les ">
          {LINE_BREAK}
          <ExternalTouchableLink
            as={LinkInsideTextBlack}
            wording="conditions générales d’utilisation"
            externalNav={{ url: env.CGU_LINK }}
          />
        </BulletListItem>
        <BulletListItem text="si tu as un dossier en cours, tu ne pourras pas en déposer un nouveau" />
        <BulletListItem text="tu n’auras plus accès au catalogue" />
      </VerticalUl>
      <StyledBodyAccent>Les données que nous conservons&nbsp;:</StyledBodyAccent>
      <Typo.Body>
        Nous gardons toutes les informations personnelles que tu nous as transmises lors de la
        vérification de ton identité.
      </Typo.Body>
    </GenericInfoPage>
  )
}

const LinkInsideTextBlack = styled(LinkInsideText).attrs(({ theme }) => ({
  color: theme.designSystem.color.text.default,
}))``

const StyledBodyAccent = styled(Typo.BodyAccent)({
  marginTop: getSpacing(5),
})
