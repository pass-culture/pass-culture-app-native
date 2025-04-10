import React, { FC } from 'react'

import { NotificationAuthModal } from 'features/offer/components/NotificationAuthModal/NotificationAuthModal'
import {
  StickyFooterContentBase,
  StickyFooterContentProps,
} from 'features/offer/components/OfferContent/StickyFooterContent/StickyFooterContentBase'
import { StickyFooterNotificationsProps } from 'features/offer/components/OfferFooter/types'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { Bell } from 'ui/svg/icons/Bell'
import { BellFilled } from 'ui/svg/icons/BellFilled'

type Props = StickyFooterContentProps & StickyFooterNotificationsProps

export const StickyFooterContent: FC<Props> = (props) => {
  return (
    <StickyFooterContentBase {...props}>
      <ButtonTertiaryBlack
        wording={props.hasReminder ? 'Désactiver le rappel' : 'Ajouter un rappel'}
        onPress={props.onPressReminderCTA}
        icon={props.hasReminder ? BellFilled : Bell}
      />
      <NotificationAuthModal
        visible={props.reminderAuthModal.visible}
        offerId={props.offerId}
        dismissModal={props.reminderAuthModal.hideModal}
      />
    </StickyFooterContentBase>
  )
}
