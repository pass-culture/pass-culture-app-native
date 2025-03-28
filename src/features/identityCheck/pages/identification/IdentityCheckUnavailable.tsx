import { useRoute } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { DMSModal } from 'features/identityCheck/components/modals/DMSModal'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { useModal } from 'ui/components/modals/useModal'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { HappyFace } from 'ui/svg/icons/HappyFace'
import { Typo } from 'ui/theme'

export function IdentityCheckUnavailable() {
  const { params } = useRoute<UseRouteType<'IdentityCheckUnavailable'>>()

  const { visible, showModal, hideModal } = useModal(false)

  const showDMSModal = () => {
    analytics.logStartDMSTransmission()
    showModal()
  }

  return (
    <GenericInfoPageWhite
      illustration={HappyFace}
      title="Victime de notre succès&nbsp;!"
      buttonPrimary={
        params?.withDMS
          ? { wording: 'Transmettre un dossier', onPress: showDMSModal, icon: ExternalSite }
          : { wording: 'Retourner à l’accueil', navigateTo: navigateToHomeConfig }
      }
      buttonSecondary={
        params?.withDMS
          ? { wording: 'Retourner à l’accueil', navigateTo: navigateToHomeConfig }
          : undefined
      }>
      <ViewGap gap={5}>
        <StyledBody>
          Vous êtes actuellement très nombreux à vouloir créer un compte, notre service rencontre
          quelques difficultés.
        </StyledBody>
        <StyledBody>Nous reviendrons vers toi dès que le service sera rétabli.</StyledBody>
        {params?.withDMS ? (
          <StyledBody>
            Tu peux nous transmettre ton dossier via la plateforme Démarches Simplifiées. Nous
            reviendrons vers toi d’ici quelques jours.
          </StyledBody>
        ) : null}
      </ViewGap>
      <DMSModal visible={visible} hideModal={hideModal} />
    </GenericInfoPageWhite>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
