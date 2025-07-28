import React, { FC } from 'react'

import { RemindersCTA } from 'features/offer/components/OfferContent/ComingSoonCTAs/RemindersCTA'
import {
  StickyFooterContentBase,
  StickyFooterContentProps,
} from 'features/offer/components/OfferContent/StickyFooterContent/StickyFooterContentBase'
import { StickyFooterNotificationsProps } from 'features/offer/components/OfferFooter/types'

type Props = StickyFooterContentProps & StickyFooterNotificationsProps

export const StickyFooterContent: FC<Props> = (props) => {
  return (
    <StickyFooterContentBase {...props}>
      <RemindersCTA {...props} />
    </StickyFooterContentBase>
  )
}
