import React from 'react'
import { Platform, ScrollView, useWindowDimensions } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { BookingResponse, TicketDisplayEnum, UserProfileResponse } from 'api/gen'
import { ArchiveBookingModal } from 'features/bookings/components/ArchiveBookingModal'
import { BookingDetailsCancelButton } from 'features/bookings/components/BookingDetailsCancelButton'
import { BookingDetailsContentDesktop } from 'features/bookings/components/BookingDetailsContentDesktop'
import { BookingDetailsContentMobile } from 'features/bookings/components/BookingDetailsContentMobile'
import { BookingDetailsHeader } from 'features/bookings/components/BookingDetailsHeader'
import { BookingPrecisions } from 'features/bookings/components/BookingPrecision'
import { CancelBookingModal } from 'features/bookings/components/CancelBookingModal'
import { Ticket } from 'features/bookings/components/Ticket/Ticket'
import {
  EXTRA_ANDROID_MARGIN,
  MARGIN_TOP_TICKET,
  computeHeaderImageHeight,
} from 'features/bookings/helpers/computeHeaderImageHeight'
import { BookingProperties } from 'features/bookings/types'
import { isCloseToBottom } from 'libs/analytics'
import { analytics } from 'libs/analytics/provider'
import { useFunctionOnce } from 'libs/hooks'
import { SubcategoriesMapping } from 'libs/subcategories/types'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { ErrorBanner } from 'ui/components/banners/ErrorBanner'
import { HeaderWithImage } from 'ui/components/headers/HeaderWithImage'
import { useModal } from 'ui/components/modals/useModal'

const scrollIndicatorInsets = { right: 1 }

export const BookingDetailsContent = ({
  properties,
  booking,
  mapping,
  user,
}: {
  properties: BookingProperties
  booking: BookingResponse
  mapping: SubcategoriesMapping
  user: UserProfileResponse
}) => {
  const { isDesktopViewport } = useTheme()
  const { height: windowHeight } = useWindowDimensions()
  const [topBlockHeight, setTopBlockHeight] = React.useState<number>(0)
  const display = properties.isEvent === true ? 'punched' : 'full'
  const { headerImageHeight, scrollContentHeight } = computeHeaderImageHeight({
    topBlockHeight,
    windowHeight,
    display,
    isAndroid: Platform.OS === 'android',
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

  const isNoTicket = booking.ticket.display === TicketDisplayEnum.no_ticket
  const errorBannerMessage = `Tu n’as pas le droit de céder ou de revendre ${properties.isDuo ? 'tes billets' : 'ton billet'}.`
  return booking.ticket ? (
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
            leftBlock={
              <Ticket
                properties={properties}
                booking={booking}
                mapping={mapping}
                user={user}
                display={display}
                setTopBlockHeight={setTopBlockHeight}
                ticket={booking.ticket}
              />
            }
            rightBlock={
              <React.Fragment>
                {isNoTicket ? null : <ErrorBanner message={errorBannerMessage} />}
                {booking.stock.offer.bookingContact || booking.ticket.withdrawal.details ? (
                  <BookingPrecisions
                    bookingContactEmail={booking.stock.offer.bookingContact}
                    withdrawalDetails={booking.ticket.withdrawal.details}
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
            topBlock={
              <Ticket
                properties={properties}
                booking={booking}
                mapping={mapping}
                user={user}
                display={display}
                setTopBlockHeight={setTopBlockHeight}
                ticket={booking.ticket}
              />
            }
            onEmailPress={onEmailPress}
            booking={booking}
            errorBannerMessage={isNoTicket ? null : errorBannerMessage}
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
  ) : null
}

const MainContainer = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.designSystem.color.background.default,
  width: '100%',
}))

const StyledHeaderWithImage = styled(HeaderWithImage)({
  marginBottom: MARGIN_TOP_TICKET + (Platform.OS === 'android' ? EXTRA_ANDROID_MARGIN : 0),
})
