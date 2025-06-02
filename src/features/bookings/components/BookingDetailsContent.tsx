import React from 'react'
import { ScrollView, useWindowDimensions } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { BookingReponse, UserProfileResponse } from 'api/gen'
import { ArchiveBookingModal } from 'features/bookings/components/ArchiveBookingModal'
import { BookingDetailsCancelButton } from 'features/bookings/components/BookingDetailsCancelButton'
import { BookingDetailsContentDesktop } from 'features/bookings/components/BookingDetailsContentDesktop'
import { BookingDetailsContentMobile } from 'features/bookings/components/BookingDetailsContentMobile'
import { BookingDetailsHeader } from 'features/bookings/components/BookingDetailsHeader'
import { BookingPrecisions } from 'features/bookings/components/BookingPrecision'
import { CancelBookingModal } from 'features/bookings/components/CancelBookingModal'
import { Ticket } from 'features/bookings/components/Ticket'
import { computeHeaderImageHeight } from 'features/bookings/helpers/computeHeaderImageHeight'
import { BookingProperties } from 'features/bookings/types'
import { offerImageContainerMarginTop } from 'features/offer/helpers/useOfferImageContainerDimensions'
import { isCloseToBottom } from 'libs/analytics'
import { analytics } from 'libs/analytics/provider'
import { useFunctionOnce } from 'libs/hooks'
import { SubcategoriesMapping } from 'libs/subcategories/types'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { ErrorBanner } from 'ui/components/banners/ErrorBanner'
import { HeaderWithImage } from 'ui/components/headers/HeaderWithImage'
import { useModal } from 'ui/components/modals/useModal'
import { getSpacing } from 'ui/theme'

const scrollIndicatorInsets = { right: 1 }

export const BookingDetailsContent = ({
  properties,
  booking,
  mapping,
  user,
}: {
  properties: BookingProperties
  booking: BookingReponse
  mapping: SubcategoriesMapping
  user: UserProfileResponse
}) => {
  const { isDesktopViewport } = useTheme()
  const { height: windowHeight } = useWindowDimensions()
  const [topBlockHeight, setTopBlockHeight] = React.useState<number>(0)

  const { headerImageHeight, scrollContentHeight } = computeHeaderImageHeight({
    topBlockHeight,
    windowHeight,
  })
  const { visible: cancelModalVisible, showModal: showCancelModal, hideModal } = useModal(false)
  const {
    visible: archiveModalVisible,
    showModal: showArchiveModal,
    hideModal: hideArchiveModal,
  } = useModal(false)

  const { offer } = booking.stock

  const logConsultWholeBooking = useFunctionOnce(
    () => offer.id && analytics.logBookingDetailsScrolledToBottom(offer.id)
  )

  const { headerTransition, onScroll } = useOpacityTransition({
    listener: ({ nativeEvent }) => {
      if (isCloseToBottom(nativeEvent)) logConsultWholeBooking()
    },
  })

  const cancelBooking = () => {
    showCancelModal()
    analytics.logCancelBooking(offer.id)
  }

  const onEmailPress = () => {
    analytics.logClickEmailOrganizer()
  }

  const errorBannerMessage = `Tu n’as pas le droit de céder ou de revendre ${properties.isDuo ? 'tes billets' : 'ton billet'}.`

  const ticket = (
    <Ticket
      properties={properties}
      booking={booking}
      mapping={mapping}
      user={user}
      setTopBlockHeight={setTopBlockHeight}
    />
  )

  return (
    <MainContainer>
      <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        scrollIndicatorInsets={scrollIndicatorInsets}
        onContentSizeChange={(_w: number, h: number) => {
          if (h <= scrollContentHeight) {
            logConsultWholeBooking()
          }
        }}
        testID="BookingDetailsScrollView"
        bounces={false}>
        <StyledHeaderWithImage imageHeight={headerImageHeight} imageUrl={offer.image?.url} />
        {isDesktopViewport ? (
          <BookingDetailsContentDesktop
            headerImageHeight={headerImageHeight}
            leftBlock={ticket}
            rightBlock={
              <React.Fragment>
                <ErrorBanner message={errorBannerMessage} />
                {booking.stock.offer.bookingContact || offer.withdrawalDetails ? (
                  <BookingPrecisions
                    bookingContactEmail={booking.stock.offer.bookingContact}
                    withdrawalDetails={offer.withdrawalDetails}
                    onEmailPress={onEmailPress}
                  />
                ) : null}
                <BookingDetailsCancelButton
                  booking={booking}
                  onCancel={cancelBooking}
                  onTerminate={showArchiveModal}
                  fullWidth
                />
              </React.Fragment>
            }
          />
        ) : (
          <BookingDetailsContentMobile
            topBlock={ticket}
            onEmailPress={onEmailPress}
            booking={booking}
            errorBannerMessage={errorBannerMessage}
            cancelBooking={cancelBooking}
            showArchiveModal={showArchiveModal}
          />
        )}
        <CancelBookingModal
          visible={cancelModalVisible}
          dismissModal={hideModal}
          booking={booking}
        />
        <ArchiveBookingModal
          visible={archiveModalVisible}
          bookingId={booking.id}
          bookingTitle={offer.name}
          onDismiss={hideArchiveModal}
        />
      </ScrollView>
      {/* BookingDetailsHeader is called after Body to implement the BlurView for iOS */}
      <BookingDetailsHeader headerTransition={headerTransition} title={offer.name} />
    </MainContainer>
  )
}

const MainContainer = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.designSystem.color.background.default,
  width: '100%',
}))

const StyledHeaderWithImage = styled(HeaderWithImage)({
  marginBottom: getSpacing(offerImageContainerMarginTop),
})
