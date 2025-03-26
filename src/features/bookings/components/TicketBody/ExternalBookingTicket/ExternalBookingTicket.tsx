import React, { FC } from 'react'

import { BookingVenueResponse, SubcategoryIdEnum } from 'api/gen'
import { getQrCodeWithSeat } from 'features/bookings/components/TicketBody/ExternalBookingTicket/getQrCodeWithSeat'
import { HiddenQrCodeWithSeat } from 'features/bookings/components/TicketBody/ExternalBookingTicket/HiddenQrCodeWithSeat/HiddenQrCodeWithSeat'
import {
  QrCodeWithSeat,
  QrCodeWithSeatProps,
} from 'features/bookings/components/TicketBody/QrCodeWithSeat/QrCodeWithSeat'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

type ExternalBookingTicket = QrCodeWithSeatProps & {
  subcategoryId: SubcategoryIdEnum
  beginningDatetime: string | undefined
  qrCodeVisibilityHoursBeforeEvent: number
  categoriesToHide?: SubcategoryIdEnum[]
  venue: BookingVenueResponse
  barCodeInfo: React.JSX.Element | null
}

export const ExternalBookingTicket: FC<ExternalBookingTicket> = ({
  subcategoryId,
  categoriesToHide = [],
  qrCodeVisibilityHoursBeforeEvent,
  beginningDatetime,
  venue,
  ...seatWithQrCodeProps
}) => {
  const enableHideTicket = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_HIDE_TICKET)

  const { day, time, shouldQrCodeBeHidden } = getQrCodeWithSeat({
    beginningDatetime,
    qrCodeVisibilityHoursBeforeEvent,
    subcategoryId,
    venue,
    categoriesToHide,
    enableHideTicket,
  })

  return shouldQrCodeBeHidden ? (
    <HiddenQrCodeWithSeat day={day} time={time} />
  ) : (
    <QrCodeWithSeat {...seatWithQrCodeProps} />
  )
}
