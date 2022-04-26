import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { useAccountSuspend } from 'features/auth/api'
import { useLogoutRoutine } from 'features/auth/AuthContext'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { env } from 'libs/environment'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { styledButton } from 'ui/components/buttons/styledButton'
import { GenericInfoPageWhite } from 'ui/components/GenericInfoPageWhite'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Touchable } from 'ui/components/touchable/Touchable'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { BicolorError } from 'ui/svg/icons/BicolorError'
import { Dot } from 'ui/svg/icons/Dot'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typography'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'
import { Li } from 'ui/web/list/Li'
import { VerticalUl } from 'ui/web/list/Ul'

export function ConfirmDeleteProfile() {
  const { navigate } = useNavigation<UseNavigationType>()
  const { goBack, canGoBack } = useGoBack(...getTabNavConfig('Profile'))
  const { top } = useCustomSafeInsets()

  const signOut = useLogoutRoutine()
  const { showErrorSnackBar } = useSnackBarContext()

  function onAccountSuspendSuccess() {
    navigate('DeleteProfileSuccess')
    signOut()
  }

  function onAccountSuspendFailure() {
    showErrorSnackBar({
      message: t`Une erreur s’est produite pendant le chargement.`,
      timeout: SNACK_BAR_TIME_OUT,
    })
  }

  const { mutate: notifyAccountSuspend, isLoading } = useAccountSuspend(
    onAccountSuspendSuccess,
    onAccountSuspendFailure
  )

  return (
    <GenericInfoPageWhite
      header={
        !!canGoBack() && (
          <HeaderContainer onPress={goBack} top={top + getSpacing(3.5)} testID="Revenir en arrière">
            <StyledArrowPrevious />
          </HeaderContainer>
        )
      }
      separateIconFromTitle={false}
      icon={BicolorError}
      titleComponent={TitleComponent}
      title={t`Veux-tu vraiment supprimer ton compte\u00a0?`}>
      <Content>
        <Typo.ButtonText>{t`Les conséquences\u00a0:`}</Typo.ButtonText>
        <VerticalUl>
          <ListItem text={t`tes réservations seront annulées et supprimées`} />
          <ListItem
            text={t`si tu as un dossier en cours, tu ne pourras pas en déposer un nouveau`}
          />
          <ListItem text={t`tu n’auras plus accès au catalogue`} />
        </VerticalUl>

        <Spacer.Column numberOfSpaces={5} />

        <Typo.ButtonText>{t`Les données qu’on conserve\u00a0:`}</Typo.ButtonText>
        <Typo.Body>{t`Nous gardons toutes les informations personnelles que tu nous as transmises lors de la vérification de ton identité.`}</Typo.Body>

        <Spacer.Column numberOfSpaces={14} />
        <ButtonContainer>
          <ButtonPrimary
            wording={t`Supprimer mon compte`}
            isLoading={isLoading}
            onPress={notifyAccountSuspend}
          />
          <Spacer.Column numberOfSpaces={4} />
          <TouchableLink
            as={ButtonTertiaryBlack}
            wording={t`Consulter l’article d’aide`}
            externalNav={{ url: env.FAQ_LINK_DELETE_ACCOUNT }}
            icon={ExternalSiteFilled}
          />
        </ButtonContainer>
      </Content>
    </GenericInfoPageWhite>
  )
}

const TitleComponent = styled(Typo.Title2).attrs(getHeadingAttrs(1))``

const StyledArrowPrevious = styled(ArrowPrevious).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
  accessibilityLabel: t`Revenir en arrière`,
}))``

const HeaderContainer = styledButton(Touchable)<{ top: number }>(({ theme, top }) => ({
  position: 'absolute',
  top,
  left: getSpacing(6),
  zIndex: theme.zIndex.floatingButton,
}))

const Content = styled.View({
  marginTop: getSpacing(2),
})

const ButtonContainer = styled.View({
  marginTop: getSpacing(3),
})

const ItemContainer = styled.View({
  flexDirection: 'row',
  marginLeft: getSpacing(3),
})

const Bullet = styled(Dot).attrs({
  size: 3,
})``

const BulletContainer = styled.View(({ theme }) => ({
  height: theme.typography.body.lineHeight,
  justifyContent: 'center',
  marginRight: getSpacing(3),
}))

const ListItem = ({ text }: { text: string }) => {
  return (
    <Li>
      <ItemContainer>
        <BulletContainer>
          <Bullet />
        </BulletContainer>
        <Typo.Body>{text}</Typo.Body>
      </ItemContainer>
    </Li>
  )
}
