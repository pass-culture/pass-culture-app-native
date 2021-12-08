import { t } from '@lingui/macro'
import React, { useCallback, useState, FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { navigateToHome, openUrl } from 'features/navigation/helpers'
import { navigateFromRef, canGoBackFromRef, goBackFromRef } from 'features/navigation/navigationRef'
import { env } from 'libs/environment'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { ButtonTertiaryGreyDark } from 'ui/components/buttons/ButtonTertiaryGreyDark'
import { AppModal } from 'ui/components/modals/AppModal'
import { Close } from 'ui/svg/icons/Close'
import { ExternalLinkSite } from 'ui/svg/icons/ExternalLinkSite'
import { ColorsEnum, Spacer, Typo, getSpacing } from 'ui/theme'

export interface Props {
  visible: boolean
  onApproval: () => void
  onRefusal: () => void
  disableBackdropTap?: boolean
}

const cookieButtonText = 'Politique des cookies'

export const PrivacyPolicyModal: FunctionComponent<Props> = ({
  visible,
  onApproval,
  onRefusal,
  disableBackdropTap = true,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(visible)

  const goToConsentSettings = useCallback(() => {
    navigateFromRef('ConsentSettings', {
      onGoBack: () => {
        setIsVisible(true)
        if (canGoBackFromRef()) {
          goBackFromRef()
        } else {
          navigateToHome()
        }
      },
    })
    setIsVisible(false)
  }, [navigateFromRef, canGoBackFromRef, goBackFromRef])

  async function openCookiesPolicyExternalUrl() {
    await openUrl(env.COOKIES_POLICY_LINK)
  }

  return (
    <AppModal
      visible={isVisible}
      title={t`Respect de ta vie privée`}
      disableBackdropTap={disableBackdropTap}
      leftIconAccessibilityLabel={undefined}
      leftIcon={undefined}
      onLeftIconPress={undefined}
      rightIconAccessibilityLabel={t`Fermer la modale et refuser la collecte des données`}
      rightIcon={Close}
      onRightIconPress={onRefusal}>
      <Description>
        <Typo.Body>
          {t`Nous utilisons des outils pour réaliser des statistiques de navigation et offrir une experience plus sûre. En cliquant sur "Autoriser", tu acceptes l'utilisation de ces services détaillés dans notre`}
        </Typo.Body>
      </Description>
      <ButtonTertiary
        title={cookieButtonText}
        onPress={openCookiesPolicyExternalUrl}
        icon={ExternalLinkSite}
        textSize={12}
      />
      <SubDescription>
        <Typo.Caption color={ColorsEnum.GREY_DARK}>
          {t`Tu peux modifier tes paramètres de confidentialité ici ou dans la page profil.`}
        </Typo.Caption>
      </SubDescription>
      <CallToActionsContainer>
        <StyleButtonSecondary title={t`Refuser`} onPress={onRefusal} />
        <Spacer.Column numberOfSpaces={3} />
        <StyleButtonPrimary title={t`Autoriser`} onPress={onApproval} />
        <Spacer.Column numberOfSpaces={2} />
        <ButtonTertiaryGreyDark
          title={t`Paramètres de confidentialité`}
          onPress={goToConsentSettings}
          textSize={getSpacing(3)}
        />
      </CallToActionsContainer>
    </AppModal>
  )
}

const CallToActionsContainer = styled.View({
  alignItems: 'center',
  width: '100%',
})

const StyleButtonPrimary = styled(ButtonPrimary)({
  maxWidth: getSpacing(80),
})

const StyleButtonSecondary = styled(ButtonSecondary)({
  maxWidth: getSpacing(80),
})

const Description = styled.Text({
  textAlign: 'center',
})

const SubDescription = styled.Text({
  textAlign: 'center',
  paddingVertical: 20,
  paddingHorizontal: '10%',
})
