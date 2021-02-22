import { t } from '@lingui/macro'
import React, { useEffect } from 'react'

import { CategoryType } from 'api/gen'
import { BookingDetails } from 'features/bookOffer/components/BookingDetails'
import { BookingEventChoices } from 'features/bookOffer/components/BookingEventChoices'
import { _ } from 'libs/i18n'
import { AppModal } from 'ui/components/modals/AppModal'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { IconInterface } from 'ui/svg/icons/types'

import { BookingWrapper, useBooking } from './BookingOfferWrapper'
import { Step } from './reducer'

interface Props {
  visible: boolean
  dismissModal: () => void
  offerCategory: CategoryType
  offerId: number
}

const BookingOfferModalComponent: React.FC<Props> = ({
  visible,
  dismissModal,
  offerCategory,
  offerId,
}) => {
  const { bookingState, dispatch } = useBooking()

  useEffect(() => {
    dispatch({ type: 'INIT', payload: { offerId } })
  }, [])

  const goToPreviousStep = () => {
    dispatch({ type: 'MODIFY_OPTIONS' })
  }

  let title = _(t`Détails de la réservation`)
  let leftIcon: React.FC<IconInterface> | undefined = ArrowPrevious
  let onLeftIconPress = offerCategory === CategoryType.Event ? goToPreviousStep : dismissModal

  if (offerCategory === CategoryType.Event && bookingState.step !== Step.CONFIRMATION) {
    title = ''
    leftIcon = undefined
    onLeftIconPress = () => null
  }

  return (
    <AppModal
      visible={visible}
      title={title}
      leftIcon={leftIcon}
      onLeftIconPress={onLeftIconPress}
      rightIcon={Close}
      onRightIconPress={dismissModal}>
      {offerCategory === CategoryType.Event ? (
        <BookingEventChoices dismissModal={dismissModal} />
      ) : (
        <BookingDetails dismissModal={dismissModal} />
      )}
    </AppModal>
  )
}

export const BookingOfferModal: React.FC<Props> = (props) => (
  <BookingWrapper>
    <BookingOfferModalComponent {...props} />
  </BookingWrapper>
)
