import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { ReportOfferDescription } from 'features/offer/components/ReportOfferDescription'
import { AppModal } from 'ui/components/modals/AppModal'
import { Close } from 'ui/svg/icons/Close'

interface Props {
  isVisible: boolean
  dismissModal: () => void
  onPressReportOffer: () => void
}

export const ReportOfferDescriptionModal: FunctionComponent<Props> = ({
  isVisible,
  dismissModal,
  onPressReportOffer,
}) => {
  return (
    <AppModal
      visible={isVisible}
      title={t`Signaler une offre`}
      rightIcon={Close}
      onRightIconPress={dismissModal}>
      <ModalContent>
        <ReportOfferDescription onPressReportOffer={onPressReportOffer} />
      </ModalContent>
    </AppModal>
  )
}

const ModalContent = styled.View({
  width: '100%',
})
