import React from 'react'
import styled from 'styled-components/native'

import { DMSModal } from 'features/identityCheck/components/DMSModal'
import { analytics } from 'libs/firebase/analytics'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { GreyDarkCaption } from 'ui/components/GreyDarkCaption'
import { useModal } from 'ui/components/modals/useModal'
import { BicolorPhonePending } from 'ui/svg/icons/BicolorPhonePending'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { getSpacing, Spacer, Typo } from 'ui/theme'

interface Props {
  showSomeAdviceBeforeIdentityCheckModal: () => void
}

export function IdentityCheckStartContentDesktop({
  showSomeAdviceBeforeIdentityCheckModal,
}: Props) {
  const { visible, showModal, hideModal } = useModal(false)
  const showDMSModal = () => {
    analytics.logStartDMSTransmission()
    showModal()
  }

  return (
    <React.Fragment>
      <StyledBicolorPhonePending />
      <Spacer.Column numberOfSpaces={6} />
      <ContentDesktopContainer>
        <StyledTitle4>Vérifie ton identité sur ton smartphone</StyledTitle4>
        <Spacer.Column numberOfSpaces={6} />
        <StyledBody>
          Gagne du temps en vérifiant ton identité directement sur ton smartphone&nbsp;! Sinon tu
          peux passer par le site Démarches-Simplifiées mais le traitement sera plus long.
        </StyledBody>
        <Spacer.Column numberOfSpaces={2} />
        <StyledBody>
          Prends une photo de ta carte d’identité ou de ton passeport en cours de validité pour
          accéder à ton pass Culture.
        </StyledBody>
      </ContentDesktopContainer>
      <Spacer.Column numberOfSpaces={6} />
      <ButtonPrimary
        onPress={showSomeAdviceBeforeIdentityCheckModal}
        wording="Vérification par smartphone"
      />
      <Spacer.Column numberOfSpaces={8} />
      <DMSInformationContainer>
        <Body>Tu n’as pas de smartphone&nbsp;?</Body>
        <Spacer.Column numberOfSpaces={4} />
        <ButtonTertiaryBlack
          wording="Identification par le site Démarches-Simplifiées"
          onPress={showDMSModal}
          icon={ExternalFilledIcon}
        />
        <GreyDarkCaption>Environ 10 jours</GreyDarkCaption>
      </DMSInformationContainer>
      <DMSModal visible={visible} hideModal={hideModal} />
      <Spacer.Column numberOfSpaces={6} />
    </React.Fragment>
  )
}

const StyledBicolorPhonePending = styled(BicolorPhonePending).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.fullPage,
}))``

const StyledTitle4 = styled(Typo.Title4)({ textAlign: 'center' })

const StyledBody = styled(Typo.Body)({ textAlign: 'center' })

const Body = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const ExternalFilledIcon = styled(ExternalSiteFilled).attrs({ accessibilityLabel: '' })``

const ContentDesktopContainer = styled.View({ marginHorizontal: getSpacing(2) })

const DMSInformationContainer = styled.View({ alignItems: 'center', display: 'flex' })
