import { t } from '@lingui/macro'
import React from 'react'

import { CategoryType } from 'api/gen'
import { BookingDetails } from 'features/bookOffer/components/BookingDetails'
import { BookingEventChoices } from 'features/bookOffer/components/BookingEventChoices'
import { _ } from 'libs/i18n'
import { AppModal } from 'ui/components/modals/AppModal'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'

interface Props {
  visible: boolean
  dismissModal: () => void
  offerCategory: CategoryType
}

export const BookingOfferModal: React.FC<Props> = ({ visible, dismissModal, offerCategory }) => {
  if (offerCategory === CategoryType.Thing)
    return (
      <AppModal
        visible={visible}
        title={_(t`Détails de la réservation`)}
        leftIcon={ArrowPrevious}
        rightIcon={Close}
        onRightIconPress={dismissModal}>
        <BookingDetails />
      </AppModal>
    )

  return (
    <AppModal visible={visible} title="" rightIcon={Close} onRightIconPress={dismissModal}>
      <BookingEventChoices />
    </AppModal>
  )
}
