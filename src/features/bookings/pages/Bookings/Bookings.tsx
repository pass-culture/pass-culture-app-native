import { useFocusEffect, useRoute } from '@react-navigation/native'
import React, { useCallback, useState, useEffect } from 'react'
import styled from 'styled-components/native'

import { ReactionTypeEnum } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { OnGoingBookingsList } from 'features/bookings/components/OnGoingBookingsList'
import { BookingsTab } from 'features/bookings/enum'
import { EndedBookings } from 'features/bookings/pages/EndedBookings/EndedBookings'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useAvailableReactionQuery } from 'features/reactions/queries/useAvailableReactionQuery'
import { useReactionMutation } from 'features/reactions/queries/useReactionMutation'
import { TabLayout } from 'features/venue/components/TabLayout/TabLayout'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { BatchEvent, BatchProfile } from 'libs/react-native-batch'
import { storage } from 'libs/storage'
import { useBookingsV2WithConvertedTimezoneQuery } from 'queries/bookings/useBookingsQuery'
import { createLabels } from 'shared/handleTooManyCount/countUtils'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

const checkBookingPage = async () => {
  const hasSeenBookingPage = await storage.readObject<boolean>('has_seen_booking_page')

  if (!hasSeenBookingPage) {
    BatchProfile.trackEvent(BatchEvent.hasSeenBookingPage)
    await storage.saveObject('has_seen_booking_page', true)
  }
}

export const Bookings = () => {
  useEffect(() => {
    checkBookingPage()
  }, [])

  const { params } = useRoute<UseRouteType<'Bookings'>>()

  const enableReactionFeature = useFeatureFlag(RemoteStoreFeatureFlags.WIP_REACTION_FEATURE)
  const [activeTab, setActiveTab] = useState<BookingsTab>(params?.activeTab ?? BookingsTab.CURRENT)
  const [previousTab, setPreviousTab] = useState(activeTab)
  const { isLoggedIn } = useAuthContext()
  const netInfo = useNetInfoContext()
  const isQueryEnabled = !!netInfo.isConnected && !!netInfo.isInternetReachable && isLoggedIn
  const { data: bookings } = useBookingsV2WithConvertedTimezoneQuery(isQueryEnabled)
  const { mutate: addReaction } = useReactionMutation()

  const { endedBookings = [] } = bookings ?? {}

  const { data: availableReactions } = useAvailableReactionQuery()
  const numberOfReactableBookings = availableReactions?.numberOfReactableBookings ?? 0

  const { fullCountLabel, accessibilityLabel } = createLabels(
    numberOfReactableBookings,
    'réservations'
  )

  const updateReactions = useCallback(() => {
    const bookingsToUpdate =
      endedBookings
        .filter((endedBooking) => endedBooking.userReaction === null)
        .map((booking) => booking.stock.offer.id) ?? []

    const mutationPayload = bookingsToUpdate.map((bookingId) => ({
      offerId: bookingId,
      reactionType: ReactionTypeEnum.NO_REACTION,
    }))
    if (mutationPayload.length > 0) {
      addReaction({ reactions: mutationPayload })
    }
  }, [addReaction, endedBookings])

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (previousTab === BookingsTab.COMPLETED) {
          updateReactions()
        }
        if (previousTab !== activeTab) {
          setPreviousTab(activeTab)
        }
      }
    }, [activeTab, previousTab, updateReactions])
  )

  const tabPanels = {
    [BookingsTab.CURRENT]: <OnGoingBookingsList isQueryEnabled={isQueryEnabled} />,
    [BookingsTab.COMPLETED]: <EndedBookings isQueryEnabled={isQueryEnabled} />,
  }

  const shouldDisplayPastille = enableReactionFeature && numberOfReactableBookings > 0

  return (
    <Container gap={6}>
      <PageHeader title="Mes réservations" />
      <TabLayout
        tabPanels={tabPanels}
        defaultTab={params?.activeTab ?? BookingsTab.CURRENT}
        tabs={[
          { key: BookingsTab.CURRENT },
          {
            key: BookingsTab.COMPLETED,
            pastille: shouldDisplayPastille
              ? { label: fullCountLabel, accessibilityLabel: accessibilityLabel }
              : undefined,
          },
        ]}
        onTabChange={(key) => {
          setActiveTab(key)
        }}
      />
    </Container>
  )
}

const Container = styled(ViewGap)(({ theme }) => ({
  backgroundColor: theme.designSystem.color.background.default,
  flex: 1,
}))
