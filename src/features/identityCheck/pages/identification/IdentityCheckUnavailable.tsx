import { useRoute } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { DMSModal } from 'features/identityCheck/components/modals/DMSModal'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { useModal } from 'ui/components/modals/useModal'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPageDeprecated } from 'ui/pages/GenericInfoPageDeprecated'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { HappyFace } from 'ui/svg/icons/HappyFace'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { Spacer, Typo } from 'ui/theme'

export function IdentityCheckUnavailable() {
  const { params } = useRoute<UseRouteType<'IdentityCheckUnavailable'>>()

  const { visible, showModal, hideModal } = useModal(false)

  const showDMSModal = () => {
    analytics.logStartDMSTransmission()
    showModal()
  }
  return (
    <GenericInfoPageDeprecated
      title="Victime de notre succès&nbsp;!"
      icon={HappyFace}
      buttons={[
        params?.withDMS ? (
          <ButtonPrimaryWhite
            key={1}
            wording="Transmettre un dossier"
            onPress={showDMSModal}
            icon={ExternalSite}
          />
        ) : null,
        <InternalTouchableLink
          key={2}
          as={ButtonTertiaryWhite}
          wording="Retourner à l’accueil"
          navigateTo={navigateToHomeConfig}
          icon={PlainArrowPrevious}
        />,
      ].filter(Boolean)}>
      <StyledBody>
        Vous êtes actuellement très nombreux à vouloir créer un compte, notre service rencontre
        quelques difficultés.
      </StyledBody>
      <Spacer.Column numberOfSpaces={5} />
      <StyledBody>Nous reviendrons vers toi dès que le service sera rétabli.</StyledBody>
      <Spacer.Column numberOfSpaces={6} />
      {params?.withDMS ? (
        <StyledBody>
          Tu peux nous transmettre ton dossier via la plateforme Démarches Simplifiées. Nous
          reviendrons vers toi d’ici quelques jours.
        </StyledBody>
      ) : null}
      <DMSModal visible={visible} hideModal={hideModal} />
    </GenericInfoPageDeprecated>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))
