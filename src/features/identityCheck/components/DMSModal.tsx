import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'

import { AppModal } from 'ui/components/modals/AppModal'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Typo } from 'ui/theme'

interface Props {
  visible: boolean
  hideModal: () => void
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
    <Typo.Body>{t`DMS modale`}</Typo.Body>
  </AppModal>
)
