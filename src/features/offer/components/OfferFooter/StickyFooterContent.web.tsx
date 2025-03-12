import React, { FC } from 'react'

import {
  StickyFooterContentBase,
  StickyFooterContentProps,
} from 'features/offer/components/OfferFooter/StickyFooterContentBase'
import { StickyFooterNotificationsProps } from 'features/offer/components/OfferFooter/types'

type Props = StickyFooterContentProps & StickyFooterNotificationsProps

export const StickyFooterContent: FC<Props> = (props) => <StickyFooterContentBase {...props} />
