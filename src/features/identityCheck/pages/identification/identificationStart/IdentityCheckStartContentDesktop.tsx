import React from 'react'
import styled from 'styled-components/native'

import { DMSModal } from 'features/identityCheck/components/DMSModal'
import { analytics } from 'libs/firebase/analytics'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { useModal } from 'ui/components/modals/useModal'
import { BicolorPhonePending } from 'ui/svg/icons/BicolorPhonePending'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

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
        <CenteredText>
          Gagne du temps en vérifiant ton identité directement sur ton smartphone&nbsp;! Sinon tu
          peux passer par le site Démarches-Simplifiées mais le traitement sera plus long.
        </CenteredText>
        <Spacer.Column numberOfSpaces={2} />
        <CenteredText>
          Prends une photo de ta carte d’identité ou de ton passeport en cours de validité pour
          accéder à ton pass Culture.
        </CenteredText>
      </ContentDesktopContainer>
      <Spacer.Column numberOfSpaces={6} />
      <ButtonPrimary
        onPress={showSomeAdviceBeforeIdentityCheckModal}
        wording="Vérification par smartphone"
      />
      <Spacer.Column numberOfSpaces={8} />
      <DMSInformationContainer>
        <StyledBody>Tu n’as pas de smartphone&nbsp;?</StyledBody>
        <Spacer.Column numberOfSpaces={4} />
        <ButtonTertiaryBlack
          wording="Identification par le site Démarches-Simplifiées"
          onPress={showDMSModal}
          icon={ExternalFilledIcon}
        />
        <Typo.CaptionNeutralInfo>Environ 10 jours</Typo.CaptionNeutralInfo>
      </DMSInformationContainer>
      <DMSModal visible={visible} hideModal={hideModal} />
      <Spacer.Column numberOfSpaces={6} />
    </React.Fragment>
  )
}

const StyledBicolorPhonePending = styled(BicolorPhonePending).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.fullPage,
}))``

const StyledTitle4 = styled(Typo.Title4).attrs(getHeadingAttrs(2))({ textAlign: 'center' })

const CenteredText = styled(Typo.Body)({ textAlign: 'center' })

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const ExternalFilledIcon = styled(ExternalSiteFilled).attrs({ accessibilityLabel: '' })``

const ContentDesktopContainer = styled.View({ marginHorizontal: getSpacing(2) })

const DMSInformationContainer = styled.View({ alignItems: 'center', display: 'flex' })
