import { useRoute } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { DMSModal } from 'features/identityCheck/components/modals/DMSModal'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { useModal } from 'ui/components/modals/useModal'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { HappyFaceWithTear } from 'ui/svg/icons/HappyFaceWithTear'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { Typo } from 'ui/theme'

export function IdentityCheckUnavailable() {
  const { params } = useRoute<UseRouteType<'IdentityCheckUnavailable'>>()

  const { visible, showModal, hideModal } = useModal(false)

  const showDMSModal = () => {
    analytics.logStartDMSTransmission()
    showModal()
  }

  return (
    <GenericInfoPage
      illustration={HappyFaceWithTear}
      title="Victime de notre succès&nbsp;!"
      buttonPrimary={
        params?.withDMS
          ? { wording: 'Transmettre un dossier', onPress: showDMSModal, icon: ExternalSite }
          : { wording: 'Retourner à l’accueil', navigateTo: navigateToHomeConfig }
      }
      buttonTertiary={
        params?.withDMS
          ? {
              wording: 'Retourner à l’accueil',
              navigateTo: navigateToHomeConfig,
              icon: PlainArrowPrevious,
            }
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
            Tu peux nous transmettre ton dossier via la plateforme Démarche Numérique. Nous
            reviendrons vers toi d’ici quelques jours.
          </StyledBody>
        ) : null}
      </ViewGap>
      <DMSModal visible={visible} hideModal={hideModal} />
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
