import { t } from '@lingui/macro'
import { NavigationContainerRef } from '@react-navigation/native'
import React, { useCallback, useState, FunctionComponent, RefObject } from 'react'
import styled from 'styled-components/native'

import { openExternalUrl } from 'features/navigation/helpers'
import { env } from 'libs/environment'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { AppModal } from 'ui/components/modals/AppModal'
import { Close } from 'ui/svg/icons/Close'
import { ExternalLinkSite } from 'ui/svg/icons/ExternalLinkSite'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

export interface Props {
  visible: boolean
  onApproval: () => void
  onRefusal: () => void
  navigationRef?: RefObject<NavigationContainerRef>
  disableBackdropTap?: boolean
}

const cookieButtonText = 'Politique des cookies'

export const PrivacyPolicyModal: FunctionComponent<Props> = ({
  navigationRef,
  visible,
  onApproval,
  onRefusal,
  disableBackdropTap = true,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(visible)

  const goToConsentSettings = useCallback(() => {
    navigationRef?.current?.navigate('ConsentSettings', {
      onGoBack: () => {
        setIsVisible(true)
        if (navigationRef?.current?.canGoBack()) {
          navigationRef?.current?.goBack()
        }
      },
    })
    setIsVisible(false)
  }, [navigationRef])

  async function openCookiesPolicyExternalUrl() {
    await openExternalUrl(env.COOKIES_POLICY_LINK)
  }

  return (
    <AppModal
      visible={isVisible}
      title={t`Respect de ta vie privée`}
      rightIcon={Close}
      onRightIconPress={onRefusal}
      disableBackdropTap={disableBackdropTap}>
      <Description>
        <Typo.Body>
          {t`Nous utilisons des outils pour réaliser des statistiques de navigation et offrir une experience plus sûre. En cliquant sur Continuer, tu acceptes l'utilisation de ces services détaillés dans notre`}
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
      <ButtonPrimary title={t`Continuer`} onPress={onApproval} />
      <Spacer.Column numberOfSpaces={2} />
      <ButtonPrimaryWhite title={t`Paramètres de confidentialité`} onPress={goToConsentSettings} />
    </AppModal>
  )
}

const Description = styled.Text({
  textAlign: 'center',
})

const SubDescription = styled.Text({
  textAlign: 'center',
  paddingVertical: 20,
  paddingHorizontal: '10%',
})
