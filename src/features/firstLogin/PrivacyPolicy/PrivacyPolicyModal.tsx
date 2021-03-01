import { t } from '@lingui/macro'
import { NavigationContainerRef } from '@react-navigation/native'
import React, { useCallback, useState, FunctionComponent, RefObject } from 'react'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { AppModal } from 'ui/components/modals/AppModal'
import { Close } from 'ui/svg/icons/Close'
import { ExternalLinkSite } from 'ui/svg/icons/ExternalLinkSite'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

export interface Props {
  visible: boolean
  dismissModal: () => void
  navigationRef?: RefObject<NavigationContainerRef>
}

export const PrivacyPolicyModal: FunctionComponent<Props> = ({
  navigationRef,
  visible,
  dismissModal,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(visible)

  const goToConsentSettings = useCallback(() => {
    navigationRef?.current?.navigate('ConsentSettings', {
      onGoBack: () => setIsVisible(true),
    })
    setIsVisible(false)
  }, [navigationRef])

  return (
    <AppModal
      visible={isVisible}
      title={_(t`Respect de ta vie privée`)}
      rightIcon={Close}
      onRightIconPress={dismissModal}>
      <Description>
        <Typo.Body>
          {_(
            t`Nous utilisons des outils pour réaliser des statistiques de navigation et offrir une experience plus sûre. En cliquant sur Continuer, tu acceptes l'utilisation de ces services détaillés dans notre`
          )}
        </Typo.Body>
      </Description>
      <ButtonTertiaryWhite
        title={_(t`Politique des cookies`)}
        onPress={dismissModal}
        icon={ExternalLinkSite}
        textSize={12}
        disabled
      />
      <SubDescription>
        <Typo.Caption color={ColorsEnum.GREY_DARK}>
          {_(t`Tu peux modifier tes paramètres de confidentialité ici ou dans la page profil.`)}
        </Typo.Caption>
      </SubDescription>
      <ButtonPrimary title={_(t`Continuer`)} onPress={dismissModal} />
      <Spacer.Column numberOfSpaces={2} />
      <ButtonPrimaryWhite
        title={_(t`Paramètres de confidentialité`)}
        onPress={goToConsentSettings}
      />
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
