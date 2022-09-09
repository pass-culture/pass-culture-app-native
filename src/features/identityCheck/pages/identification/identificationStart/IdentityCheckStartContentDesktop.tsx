import { t } from '@lingui/macro'
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
        <Title>{t`Vérifie ton identité sur ton smartphone`}</Title>
        <Spacer.Column numberOfSpaces={6} />
        <Body>
          {t`Gagne du temps en vérifiant ton identité directement sur ton smartphone\u00a0! Sinon tu peux passer par le site Démarches-Simplifiées mais le traitement sera plus long.`}
        </Body>
        <Spacer.Column numberOfSpaces={2} />
        <Body>
          {t`Prends une photo de ta carte d'identité ou de ton passeport en cours de validité pour accéder à ton pass Culture.`}
        </Body>
      </ContentDesktopContainer>
      <Spacer.Column numberOfSpaces={6} />
      <ButtonPrimary
        onPress={showSomeAdviceBeforeIdentityCheckModal}
        wording={t`Vérification par smartphone`}
      />
      <Spacer.Column numberOfSpaces={8} />
      <DMSInformationContainer>
        <StyledBody>{t`Tu n'as pas de smartphone\u00a0?`}</StyledBody>
        <Spacer.Column numberOfSpaces={4} />
        <ButtonTertiaryBlack
          wording={t`Identification par le site Démarches-Simplifiées`}
          onPress={showDMSModal}
          icon={ExternalFilledIcon}
        />
        <GreyDarkCaption>{t`Environ 10 jours`}</GreyDarkCaption>
      </DMSInformationContainer>
      <DMSModal visible={visible} hideModal={hideModal} />
      <Spacer.Column numberOfSpaces={6} />
    </React.Fragment>
  )
}

const StyledBicolorPhonePending = styled(BicolorPhonePending).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.fullPage,
}))``

const Title = styled(Typo.Title4)({ textAlign: 'center' })

const Body = styled(Typo.Body)({ textAlign: 'center' })

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const ExternalFilledIcon = styled(ExternalSiteFilled).attrs({ accessibilityLabel: '' })``

const ContentDesktopContainer = styled.View({ marginHorizontal: getSpacing(2) })

const DMSInformationContainer = styled.View({ alignItems: 'center', display: 'flex' })
