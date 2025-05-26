import React from 'react'
import styled from 'styled-components/native'

import { BookingReponse } from 'api/gen'
import { BookingDetailsCancelButton } from 'features/bookings/components/BookingDetailsCancelButton'
import { BookingPrecisions } from 'features/bookings/components/BookingPrecision'
import { ErrorBanner } from 'ui/components/banners/ErrorBanner'
import { Separator } from 'ui/components/Separator'
import { getSpacing } from 'ui/theme'

export const BookingDetailsContentMobile = ({
  topBlock,
  booking,
  onEmailPress,
  errorBannerMessage,
  cancelBooking,
  showArchiveModal,
}: {
  topBlock: React.JSX.Element
  booking: BookingReponse
  onEmailPress: () => void
  errorBannerMessage: string
  cancelBooking: () => void
  showArchiveModal: () => void
}) => {
  return (
    <StyledContainer>
      <TicketCutoutContainer>{topBlock}</TicketCutoutContainer>
      <ErrorBannerContainer>
        <ErrorBanner message={errorBannerMessage} />
      </ErrorBannerContainer>
      {booking.stock.offer.bookingContact || booking.stock.offer.withdrawalDetails ? (
        <React.Fragment>
          <StyledSeparator height={getSpacing(8)} />
          <Container>
            <BookingPrecisions
              bookingContactEmail={booking.stock.offer.bookingContact}
              withdrawalDetails={booking.stock.offer.withdrawalDetails}
              onEmailPress={onEmailPress}
            />
          </Container>
        </React.Fragment>
      ) : null}
      <StyledSeparator height={getSpacing(8)} />
      <BookingDetailsCancelButtonContainer>
        <BookingDetailsCancelButton
          booking={booking}
          onCancel={cancelBooking}
          onTerminate={showArchiveModal}
          fullWidth
        />
      </BookingDetailsCancelButtonContainer>
    </StyledContainer>
  )
}

const StyledContainer = styled.View({ alignItems: 'center', flexDirection: 'column' })

const StyledSeparator = styled(Separator.Horizontal)({
  marginVertical: getSpacing(8),
  height: getSpacing(2),
})

const Container = styled.View({
  marginHorizontal: getSpacing(6),
  maxWidth: getSpacing(100),
})

const ErrorBannerContainer = styled(Container)({
  marginTop: getSpacing(8),
})

const BookingDetailsCancelButtonContainer = styled(Container)({
  marginBottom: getSpacing(10),
})

const TicketCutoutContainer = styled.View({
  maxWidth: getSpacing(112),
})
