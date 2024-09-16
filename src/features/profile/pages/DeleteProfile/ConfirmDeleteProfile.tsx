import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { useAccountSuspend } from 'features/auth/api/useAccountSuspend'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { BulletListItem } from 'ui/components/BulletListItem'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { VerticalUl } from 'ui/components/Ul'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { BicolorError } from 'ui/svg/icons/BicolorError'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { LINE_BREAK } from 'ui/theme/constants'

export function ConfirmDeleteProfile() {
  const { reset } = useNavigation<UseNavigationType>()
  const { showErrorSnackBar } = useSnackBarContext()

  const { suspendAccount, isLoading } = useAccountSuspend({
    onSuccess: () => {
      reset({
        index: 0,
        routes: [{ name: 'DeactivateProfileSuccess' }],
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
    <GenericInfoPageWhite
      headerGoBack
      goBackParams={getTabNavConfig('Profile')}
      separateIconFromTitle={false}
      icon={BicolorError}
      titleComponent={Typo.Title2}
      title="Veux-tu vraiment supprimer ton compte&nbsp;?">
      <Content>
        <Typo.ButtonText>Les conséquences&nbsp;:</Typo.ButtonText>
        <VerticalUl>
          <BulletListItem text="tes réservations sont annulées sauf pour certains cas précisés dans les ">
            {LINE_BREAK}
            <ExternalTouchableLink
              as={StyledButtonInsideText}
              wording="conditions générales d’utilisation"
              icon={ExternalSiteFilled}
              externalNav={{ url: env.CGU_LINK }}
            />
          </BulletListItem>
          <BulletListItem text="si tu as un dossier en cours, tu ne pourras pas en déposer un nouveau" />
          <BulletListItem text="tu n’auras plus accès au catalogue" />
        </VerticalUl>

        <Spacer.Column numberOfSpaces={5} />

        <Typo.ButtonText>Les données que nous conservons&nbsp;:</Typo.ButtonText>
        <Typo.Body>
          Nous gardons toutes les informations personnelles que tu nous as transmises lors de la
          vérification de ton identité.
        </Typo.Body>

        <Spacer.Column numberOfSpaces={14} />
        <ButtonContainer>
          <ButtonPrimary
            wording="Supprimer mon compte"
            isLoading={isLoading}
            onPress={suspendAccount}
          />
          <Spacer.Column numberOfSpaces={4} />
          <ExternalTouchableLink
            as={ButtonTertiaryBlack}
            wording="Consulter l’article d’aide"
            externalNav={{ url: env.FAQ_LINK_DELETE_ACCOUNT }}
            onBeforeNavigate={analytics.logConsultArticleAccountDeletion}
            icon={ExternalSiteFilled}
          />
        </ButtonContainer>
      </Content>
    </GenericInfoPageWhite>
  )
}

const Content = styled.View({
  marginTop: getSpacing(2),
})

const ButtonContainer = styled.View({
  marginTop: getSpacing(3),
})

const StyledButtonInsideText = styled(ButtonInsideText).attrs(({ theme }) => ({
  buttonColor: theme.colors.black,
}))``
