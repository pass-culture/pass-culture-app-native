import React, { FC } from 'react'
import { Platform, View } from 'react-native'
import styled from 'styled-components/native'

import { BookingVenueResponse, SubcategoryIdEnum } from 'api/gen'
import { getHideableQrCodeWithSeat } from 'features/bookings/components/OldBookingDetails/TicketBody/HideableQrCodeWithSeat/getHideableQrCodeWithSeat'
import {
  QrCodeWithSeat,
  QrCodeWithSeatProps,
} from 'features/bookings/components/OldBookingDetails/TicketBody/QrCodeWithSeat/QrCodeWithSeat'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import genericQrCode from 'ui/images/generic-qr-code.png'
import { BarCode } from 'ui/svg/icons/BarCode'
import { Typo } from 'ui/theme'

type HideableQrCodeWithSeatProps = QrCodeWithSeatProps & {
  subcategoryId: SubcategoryIdEnum
  beginningDatetime: string | undefined
  qrCodeVisibilityHoursBeforeEvent: number
  categoriesToHide?: SubcategoryIdEnum[]
  venue: BookingVenueResponse
}

export const HideableQrCodeWithSeat: FC<HideableQrCodeWithSeatProps> = ({
  subcategoryId,
  categoriesToHide = [],
  qrCodeVisibilityHoursBeforeEvent,
  beginningDatetime,
  venue,
  ...seatWithQrCodeProps
}) => {
  const enableHideTicket = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_HIDE_TICKET)

  const { day, time, shouldQrCodeBeHidden } = getHideableQrCodeWithSeat({
    beginningDatetime,
    qrCodeVisibilityHoursBeforeEvent,
    subcategoryId,
    venue,
    categoriesToHide,
    enableHideTicket,
  })

  if (!shouldQrCodeBeHidden) return <QrCodeWithSeat {...seatWithQrCodeProps} />

  return (
    <DashedContainer>
      <BlurredQrCodeContainer>
        <BlurredQrCode />
        <ContentContainer>
          <BarCode />
          <View>
            <StyledBody>Ton billet sera disponible ici le</StyledBody>
            <StyledBody>{day}</StyledBody>
            <StyledBody>à {time}</StyledBody>
          </View>
        </ContentContainer>
      </BlurredQrCodeContainer>
    </DashedContainer>
  )
}

const BlurredQrCodeContainer = styled.View({
  position: 'relative',
})

const BlurredQrCode = styled.ImageBackground.attrs({
  blurRadius: Platform.OS === 'android' ? 15 : 4,
  source: genericQrCode,
})(({ theme }) => ({
  width: theme.ticket.qrCodeSize,
  height: theme.ticket.qrCodeSize,
  opacity: 0.1,
}))

const StyledBody = styled(Typo.BodyAccentS)({
  textAlign: 'center',
})

const ContentContainer = styled.View({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: 'space-evenly',
  alignItems: 'center',
})

const DashedContainer = styled.View(({ theme }) => ({
  borderWidth: 2,
  borderColor: theme.designSystem.color.border.default,
  borderRadius: theme.designSystem.size.borderRadius.m,
  borderStyle: 'dashed',
  alignSelf: 'center',
}))
