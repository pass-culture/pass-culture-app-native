import React, { FunctionComponent } from 'react'

import { CategoryType } from 'api/gen'
import { AppModal } from 'ui/components/modals/AppModal'
import { Close } from 'ui/svg/icons/Close'

import { BookingDetails } from '../components/BookingDetails'
import { BookingEventChoices } from '../components/BookingEventChoices'

interface Props {
  visible: boolean
  dismissModal: () => void
  offerCategory: CategoryType
}

export const BookingOfferModal: FunctionComponent<Props> = ({
  visible,
  dismissModal,
  offerCategory,
}) => {
  return (
    <AppModal visible={visible} title="" rightIcon={Close} onRightIconPress={dismissModal}>
      {offerCategory === CategoryType.Event ? <BookingEventChoices /> : <BookingDetails />}
    </AppModal>
  )
}
