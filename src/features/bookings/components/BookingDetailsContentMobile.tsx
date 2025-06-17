import React from 'react'
import { View } from 'react-native'
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
    <View>
      <SectionContainer>
        <TicketCutoutContainer>{topBlock}</TicketCutoutContainer>

        <Container>
          <ErrorBanner message={errorBannerMessage} />
        </Container>
      </SectionContainer>

      {booking.stock.offer.bookingContact || booking.stock.offer.withdrawalDetails ? (
        <React.Fragment>
          <StyledSeparator />
          <SectionContainer>
            <Container>
              <BookingPrecisions
                bookingContactEmail={booking.stock.offer.bookingContact}
                withdrawalDetails={booking.stock.offer.withdrawalDetails}
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
  marginBottom: getSpacing(8),
  alignSelf: 'center',
})

const BookingDetailsCancelButtonContainer = styled(Container)({
  marginBottom: getSpacing(10),
})
