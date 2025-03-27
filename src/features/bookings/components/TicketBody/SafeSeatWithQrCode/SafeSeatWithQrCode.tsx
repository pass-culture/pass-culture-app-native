import React, { FC } from 'react'
import { Platform, View } from 'react-native'
import styled from 'styled-components/native'

import { BookingVenueResponse, SubcategoryIdEnum } from 'api/gen'
import { useSafeSeatWithQrCode } from 'features/bookings/components/TicketBody/SafeSeatWithQrCode/useSafeSeatWithQrCode'
import {
  SeatWithQrCode,
  SeatWithQrCodeProps,
} from 'features/bookings/components/TicketBody/SeatWithQrCode/SeatWithQrCode'
import genericQrCode from 'ui/images/generic-qr-code.png'
import { BarCode } from 'ui/svg/icons/BarCode'
import { Typo } from 'ui/theme'

type SafeSeatWithQrCodeProps = SeatWithQrCodeProps & {
  subcategoryId: SubcategoryIdEnum
  beginningDatetime: string | undefined
  qrCodeVisibilityHoursBeforeEvent: number
  categoriesToHide?: SubcategoryIdEnum[]
  venue: BookingVenueResponse
}

export const SafeSeatWithQrCode: FC<SafeSeatWithQrCodeProps> = ({
  subcategoryId,
  categoriesToHide = [],
  qrCodeVisibilityHoursBeforeEvent,
  beginningDatetime,
  venue,
  ...seatWithQrCodeProps
}) => {
  const { day, time, shouldQrCodeBeHidden } = useSafeSeatWithQrCode({
    beginningDatetime,
    qrCodeVisibilityHoursBeforeEvent,
    subcategoryId,
    venue,
    categoriesToHide,
  })

  if (!shouldQrCodeBeHidden) return <SeatWithQrCode {...seatWithQrCodeProps} />

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
  borderColor: theme.colors.greySemiDark,
  borderRadius: 8,
  borderStyle: 'dashed',
  alignSelf: 'center',
}))
