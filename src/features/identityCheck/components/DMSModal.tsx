import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'

import { openUrl } from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { AppModal } from 'ui/components/modals/AppModal'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { ExternalLinkSquare } from 'ui/svg/icons/ExternalLinkSquare'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

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
    leftIconAccessibilityLabel={t`Revenir en arrière`}
    leftIcon={ArrowPrevious}
    onLeftIconPress={hideModal}
    rightIconAccessibilityLabel={undefined}
    rightIcon={undefined}
    onRightIconPress={undefined}>
    <Typo.Body color={ColorsEnum.GREY_DARK}>
      {t`Tu peux aussi compléter ton dossier sur Démarches simplifiées. Attention le traitement sera plus long\u00a0!`}
    </Typo.Body>
    <Spacer.Column numberOfSpaces={8} />
    <ButtonTertiaryBlack
      title={t`Je suis de nationalité française`}
      onPress={openDMSFrenchCitizenURL}
      icon={ExternalLinkSquare}
      justifyContent="flex-start"
    />
    <Typo.Caption color={ColorsEnum.GREY_DARK}>{t`Carte d’identité ou passeport.`}</Typo.Caption>
    <Spacer.Column numberOfSpaces={8} />
    <ButtonTertiaryBlack
      title={t`Je suis de nationalité étrangère`}
      onPress={openDMSForeignCitizenURL}
      icon={ExternalLinkSquare}
      justifyContent="flex-start"
    />
    <Typo.Caption color={ColorsEnum.GREY_DARK}>
      {t`Titre de séjour, carte d'identité, ou passeport.`}
    </Typo.Caption>
    <Spacer.Column numberOfSpaces={4} />
  </AppModal>
)
