import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { AppModal } from 'ui/components/modals/AppModal'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { Button } from 'ui/designSystem/Button/Button'
import { Close } from 'ui/svg/icons/Close'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Typo } from 'ui/theme'

interface Props {
  visible: boolean
  hideModal: () => void
}

const onDMSFrenchCitizenPress = () => {
  analytics.logOpenDMSFrenchCitizenURL()
}

const onDMSForeignCitizenPress = () => {
  analytics.logOpenDMSForeignCitizenURL()
}

export const DMSModal: FunctionComponent<Props> = ({ visible, hideModal }) => (
  <AppModal
    visible={visible}
    title="Transmettre un document"
    rightIconAccessibilityLabel="Fermer la modale pour transmettre un document sur le site Démarche Numérique"
    rightIcon={Close}
    onRightIconPress={hideModal}>
    <StyledBody>
      Tu peux aussi compléter ton dossier sur Démarche Numérique. Attention le traitement sera plus
      long&nbsp;!
    </StyledBody>
    <ExternalLinkContainer>
      <ExternalTouchableLink
        as={Button}
        variant="tertiary"
        color="neutral"
        wording="Je suis de nationalité française"
        externalNav={{ url: env.DMS_FRENCH_CITIZEN_URL }}
        onBeforeNavigate={onDMSFrenchCitizenPress}
        icon={ExternalSiteFilled}
        justifyContent="flex-start"
      />
    </ExternalLinkContainer>
    <StyledBodyAccentXs>Carte d’identité ou passeport.</StyledBodyAccentXs>
    <ExternalLinkContainer>
      <ExternalTouchableLink
        as={Button}
        variant="tertiary"
        color="neutral"
        wording="Je suis de nationalité étrangère"
        externalNav={{ url: env.DMS_FOREIGN_CITIZEN_URL }}
        onBeforeNavigate={onDMSForeignCitizenPress}
        icon={ExternalSiteFilled}
        justifyContent="flex-start"
      />
    </ExternalLinkContainer>
    <StyledBodyAccentContainer>
      <StyledBodyAccentXs>Titre de séjour, carte d’identité, ou passeport.</StyledBodyAccentXs>
    </StyledBodyAccentContainer>
  </AppModal>
)

const ExternalLinkContainer = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xxl,
}))
const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
  alignSelf: 'center',
}))

const StyledBodyAccentContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.l,
}))
