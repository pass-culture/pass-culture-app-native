import { t } from '@lingui/macro'
import { useRoute } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { DMSModal } from 'features/identityCheck/components/DMSModal'
import { navigateToHome } from 'features/navigation/helpers'
import { UseRouteType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { useModal } from 'ui/components/modals/useModal'
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
    <GenericInfoPage
      title={t`Victime de notre succès\u00a0!`}
      icon={HappyFace}
      buttons={[
        !!params?.withDMS && (
          <ButtonPrimaryWhite
            key={1}
            wording={t`Transmettre un dossier`}
            onPress={showDMSModal}
            icon={ExternalSite}
          />
        ),
        <ButtonTertiaryWhite
          key={2}
          wording={t`Retourner à l'accueil`}
          onPress={navigateToHome}
          icon={PlainArrowPrevious}
        />,
      ].filter(Boolean)}>
      <StyledBody>{t`Vous êtes actuellement très nombreux à vouloir créer un compte, notre service rencontre quelques difficultés.`}</StyledBody>
      <Spacer.Column numberOfSpaces={5} />
      <StyledBody>{t`Nous reviendrons vers toi dès que le service sera rétabli.`}</StyledBody>
      <Spacer.Column numberOfSpaces={6} />
      {!!params?.withDMS && (
        <StyledBody>{t`Tu peux nous transmettre ton dossier via la plateforme Démarches Simplifiées.
Nous reviendrons vers toi d’ici quelques jours.`}</StyledBody>
      )}
      <DMSModal visible={visible} hideModal={hideModal} />
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))
