import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { BookingResponse } from 'api/gen'
import { BookingDetailsCancelButton } from 'features/bookings/components/BookingDetailsCancelButton'
import { BookingPrecisions } from 'features/bookings/components/BookingPrecision'
import { Separator } from 'ui/components/Separator'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { BannerType } from 'ui/designSystem/Banner/enums'
import { getSpacing } from 'ui/theme'

export const BookingDetailsContentMobile = ({
  topBlock,
  booking,
  onEmailPress,
  errorBannerMessage,
  cancelBooking,
  showArchiveModal,
  hasTicket,
  bottom,
}: {
  topBlock: React.JSX.Element
  booking: BookingResponse
  onEmailPress: () => void
  errorBannerMessage: string | null
  cancelBooking: () => void
  showArchiveModal: () => void
  hasTicket: boolean
  bottom: number
}) => {
  return (
    <View testID="booking_details_mobile">
      <SectionContainer>
        <TicketCutoutContainer>{topBlock}</TicketCutoutContainer>
        {errorBannerMessage ? (
          <ErrorBannerContainer>
            <Banner type={BannerType.ERROR} label={errorBannerMessage} />
          </ErrorBannerContainer>
        ) : null}
      </SectionContainer>

      {booking.stock.offer.bookingContact || booking.ticket?.withdrawal.details ? (
        <React.Fragment>
          <StyledSeparator />
          <SectionContainer>
            <Container>
              <BookingPrecisions
                bookingContactEmail={booking.stock.offer.bookingContact}
                withdrawalDetails={booking.ticket?.withdrawal.details}
                onEmailPress={onEmailPress}
                hasTicket={hasTicket}
              />
            </Container>
          </SectionContainer>
        </React.Fragment>
      ) : null}

      <StyledSeparator />
      <SectionContainer>
        <BookingDetailsCancelButtonContainer paddingBottom={bottom}>
          <BookingDetailsCancelButton
            booking={booking}
            onCancel={cancelBooking}
            onTerminate={showArchiveModal}
            fullWidth
          />
        </BookingDetailsCancelButtonContainer>
      </SectionContainer>
    </View>
  )
}

const MAX_CONTENT_WIDTH = getSpacing(100)

const StyledSeparator = styled(Separator.Horizontal)(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.xxl,
  height: theme.designSystem.size.spacing.s,
}))

const SectionContainer = styled.View(({ theme }) => ({
  alignItems: 'center',
  paddingHorizontal: theme.designSystem.size.spacing.xl,
  width: '100%',
}))

const Container = styled.View({
  width: '100%',
  maxWidth: MAX_CONTENT_WIDTH,
})

const TicketCutoutContainer = styled.View({
  width: '100%',
  maxWidth: MAX_CONTENT_WIDTH,
  alignSelf: 'center',
})

const BookingDetailsCancelButtonContainer = styled(Container)<{ paddingBottom: number }>(
  ({ paddingBottom, theme }) => ({
    paddingBottom: paddingBottom + theme.designSystem.size.spacing.xl,
  })
)

const ErrorBannerContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xxl,
}))
