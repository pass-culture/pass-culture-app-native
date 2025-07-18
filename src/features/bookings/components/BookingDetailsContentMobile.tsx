import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { BookingResponse } from 'api/gen'
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
  booking: BookingResponse
  onEmailPress: () => void
  errorBannerMessage: string | null
  cancelBooking: () => void
  showArchiveModal: () => void
}) => {
  return (
    <View>
      <SectionContainer>
        <TicketCutoutContainer>{topBlock}</TicketCutoutContainer>

        {errorBannerMessage ? (
          <ErrorBannerContainer>
            <ErrorBanner message={errorBannerMessage} />
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
              />
            </Container>
          </SectionContainer>
        </React.Fragment>
      ) : null}

      <StyledSeparator />
      <SectionContainer>
        <BookingDetailsCancelButtonContainer>
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
const HORIZONTAL_PADDING = getSpacing(6)
const VERTICAL_SPACING = getSpacing(8)

const StyledSeparator = styled(Separator.Horizontal)({
  marginVertical: VERTICAL_SPACING,
  height: getSpacing(2),
})

const SectionContainer = styled.View({
  alignItems: 'center',
  paddingHorizontal: HORIZONTAL_PADDING,
  width: '100%',
})

const Container = styled.View({
  width: '100%',
  maxWidth: MAX_CONTENT_WIDTH,
})

const TicketCutoutContainer = styled.View({
  width: '100%',
  maxWidth: MAX_CONTENT_WIDTH,
  alignSelf: 'center',
})

const BookingDetailsCancelButtonContainer = styled(Container)({
  marginBottom: getSpacing(10),
})

const ErrorBannerContainer = styled(Container)({ marginTop: getSpacing(8) })
