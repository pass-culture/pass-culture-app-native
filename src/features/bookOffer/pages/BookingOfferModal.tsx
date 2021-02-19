import { t } from '@lingui/macro'
import React from 'react'

import { CategoryType } from 'api/gen'
import { BookingDetails } from 'features/bookOffer/components/BookingDetails'
import { BookingEventChoices } from 'features/bookOffer/components/BookingEventChoices'
import { _ } from 'libs/i18n'
import { AppModal } from 'ui/components/modals/AppModal'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'

import { BookingWrapper } from './BookingOfferWrapper'

interface Props {
  visible: boolean
  dismissModal: () => void
  offerCategory: CategoryType
}

export const BookingOfferModal: React.FC<Props> = ({ visible, dismissModal, offerCategory }) => {
  const title = offerCategory === CategoryType.Thing ? _(t`Détails de la réservation`) : ''
  const leftIcon = offerCategory === CategoryType.Thing ? ArrowPrevious : undefined
  const onLeftIconPress = offerCategory === CategoryType.Thing ? dismissModal : undefined

  return (
    <BookingWrapper>
      <AppModal
        visible={visible}
        title={title}
        leftIcon={leftIcon}
        onLeftIconPress={onLeftIconPress}
        rightIcon={Close}
        onRightIconPress={dismissModal}>
        {offerCategory === CategoryType.Thing ? <BookingDetails /> : <BookingEventChoices />}
      </AppModal>
    </BookingWrapper>
  )
}
