import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { useAccountSuspend } from 'features/auth/api'
import { useLogoutRoutine } from 'features/auth/AuthContext'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { env } from 'libs/environment'
import { analytics } from 'libs/firebase/analytics'
import { BulletListItem } from 'ui/components/BulletListItem'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { GenericInfoPageWhite } from 'ui/components/GenericInfoPageWhite'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { VerticalUl } from 'ui/components/Ul'
import { BicolorError } from 'ui/svg/icons/BicolorError'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export function ConfirmDeleteProfile() {
  const { navigate } = useNavigation<UseNavigationType>()

  const signOut = useLogoutRoutine()
  const { showErrorSnackBar } = useSnackBarContext()

  async function onAccountSuspendSuccess() {
    navigate('DeleteProfileSuccess')
    await signOut()
  }

  function onAccountSuspendFailure() {
    showErrorSnackBar({
      message: 'Une erreur s’est produite pendant le chargement.',
      timeout: SNACK_BAR_TIME_OUT,
    })
  }

  const { mutate: notifyAccountSuspend, isLoading } = useAccountSuspend(
    onAccountSuspendSuccess,
    onAccountSuspendFailure
  )

  return (
    <GenericInfoPageWhite
      headerGoBack
      goBackParams={getTabNavConfig('Profile')}
      separateIconFromTitle={false}
      icon={BicolorError}
      titleComponent={TitleComponent}
      title="Veux-tu vraiment supprimer ton compte&nbsp;?">
      <Content>
        <Typo.ButtonText>Les conséquences&nbsp;:</Typo.ButtonText>
        <VerticalUl>
          <BulletListItem text="tes réservations seront annulées et supprimées" />
          <BulletListItem text="si tu as un dossier en cours, tu ne pourras pas en déposer un nouveau" />
          <BulletListItem text="tu n’auras plus accès au catalogue" />
        </VerticalUl>

        <Spacer.Column numberOfSpaces={5} />

        <Typo.ButtonText>Les données qu’on conserve&nbsp;:</Typo.ButtonText>
        <Typo.Body>
          Nous gardons toutes les informations personnelles que tu nous as transmises lors de la
          vérification de ton identité.
        </Typo.Body>

        <Spacer.Column numberOfSpaces={14} />
        <ButtonContainer>
          <ButtonPrimary
            wording="Supprimer mon compte"
            isLoading={isLoading}
            onPress={notifyAccountSuspend}
          />
          <Spacer.Column numberOfSpaces={4} />
          <TouchableLink
            as={ButtonTertiaryBlack}
            wording="Consulter l’article d’aide"
            externalNav={{ url: env.FAQ_LINK_DELETE_ACCOUNT }}
            onPress={analytics.logConsultArticleAccountDeletion}
            icon={ExternalSiteFilled}
          />
        </ButtonContainer>
      </Content>
    </GenericInfoPageWhite>
  )
}

const TitleComponent = styled(Typo.Title2).attrs(getHeadingAttrs(1))``

const Content = styled.View({
  marginTop: getSpacing(2),
})

const ButtonContainer = styled.View({
  marginTop: getSpacing(3),
})
