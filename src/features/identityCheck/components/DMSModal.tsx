import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { openUrl } from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { AppModal } from 'ui/components/modals/AppModal'
import { Close } from 'ui/svg/icons/Close'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Spacer, Typo } from 'ui/theme'
import { A } from 'ui/web/link/A'

interface Props {
  visible: boolean
  hideModal: () => void
}

const openDMSFrenchCitizenURL = () => {
  analytics.logOpenDMSFrenchCitizenURL()
  openUrl(env.DMS_FRENCH_CITIZEN_URL)
}

const openDMSForeignCitizenURL = () => {
  analytics.logOpenDMSForeignCitizenURL()
  openUrl(env.DMS_FOREIGN_CITIZEN_URL)
}

export const DMSModal: FunctionComponent<Props> = ({ visible, hideModal }) => (
  <AppModal
    visible={visible}
    title={t`Transmettre un document`}
    leftIconAccessibilityLabel={undefined}
    leftIcon={undefined}
    onLeftIconPress={undefined}
    rightIconAccessibilityLabel={t`Fermer la modale pour transmettre un document sur le site Démarches Simplifiée`}
    rightIcon={Close}
    onRightIconPress={hideModal}>
    <StyledBody>
      {t`Tu peux aussi compléter ton dossier sur Démarches simplifiées. Attention le traitement sera plus long\u00a0!`}
    </StyledBody>
    <Spacer.Column numberOfSpaces={8} />
    <A href={env.DMS_FRENCH_CITIZEN_URL}>
      <ButtonTertiaryBlack
        wording={t`Je suis de nationalité française`}
        onPress={openDMSFrenchCitizenURL}
        icon={ExternalSiteFilled}
        justifyContent="flex-start"
      />
    </A>
    <StyledCaption>{t`Carte d’identité ou passeport.`}</StyledCaption>
    <Spacer.Column numberOfSpaces={8} />
    <A href={env.DMS_FOREIGN_CITIZEN_URL}>
      <ButtonTertiaryBlack
        wording={t`Je suis de nationalité étrangère`}
        onPress={openDMSForeignCitizenURL}
        icon={ExternalSiteFilled}
        justifyContent="flex-start"
      />
    </A>
    <StyledCaption>{t`Titre de séjour, carte d'identité, ou passeport.`}</StyledCaption>
    <Spacer.Column numberOfSpaces={4} />
  </AppModal>
)

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const StyledCaption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
