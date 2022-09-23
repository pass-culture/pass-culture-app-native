import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { env } from 'libs/environment'
import { analytics } from 'libs/firebase/analytics'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { GreyDarkCaption } from 'ui/components/GreyDarkCaption'
import { AppModal } from 'ui/components/modals/AppModal'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { Close } from 'ui/svg/icons/Close'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Spacer, Typo } from 'ui/theme'

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
    rightIconAccessibilityLabel="Fermer la modale pour transmettre un document sur le site Démarches Simplifiée"
    rightIcon={Close}
    onRightIconPress={hideModal}>
    <StyledBody>
      Tu peux aussi compléter ton dossier sur Démarches simplifiées. Attention le traitement sera
      plus long&nbsp;!
    </StyledBody>
    <Spacer.Column numberOfSpaces={8} />
    <TouchableLink
      as={ButtonTertiaryBlack}
      wording="Je suis de nationalité française"
      externalNav={{ url: env.DMS_FRENCH_CITIZEN_URL }}
      onPress={onDMSFrenchCitizenPress}
      icon={ExternalSiteFilled}
      justifyContent="flex-start"
    />
    <GreyDarkCaption>Carte d’identité ou passeport.</GreyDarkCaption>
    <Spacer.Column numberOfSpaces={8} />
    <TouchableLink
      as={ButtonTertiaryBlack}
      wording="Je suis de nationalité étrangère"
      externalNav={{ url: env.DMS_FOREIGN_CITIZEN_URL }}
      onPress={onDMSForeignCitizenPress}
      icon={ExternalSiteFilled}
      justifyContent="flex-start"
    />
    <GreyDarkCaption>Titre de séjour, carte d’identité, ou passeport.</GreyDarkCaption>
    <Spacer.Column numberOfSpaces={4} />
  </AppModal>
)

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
