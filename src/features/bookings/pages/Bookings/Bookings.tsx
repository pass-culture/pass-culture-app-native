import { useFocusEffect, useRoute } from '@react-navigation/native'
import React, { useCallback, useState, useEffect } from 'react'
import styled from 'styled-components/native'

import { PostReactionRequest, ReactionTypeEnum } from 'api/gen'
import { OnGoingBookingsList } from 'features/bookings/components/OnGoingBookingsList'
import {
  BookingsTab,
  mapBookingsStatusToActiveTab,
  mapBookingsToActiveTab,
} from 'features/bookings/enum'
import { convertBookingsResponseV2 } from 'features/bookings/helpers/v2/convertBookingsResponseV2'
import { EndedBookings } from 'features/bookings/pages/EndedBookings/EndedBookings'
import { convertBookingsListResponseV2DatesToTimezone } from 'features/bookings/queries/selectors/convertBookingsDatesToTimezone'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useAvailableReactionQuery } from 'features/reactions/queries/useAvailableReactionQuery'
import { useReactionMutation } from 'features/reactions/queries/useReactionMutation'
import { TabLayout } from 'features/venue/components/TabLayout/TabLayout'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { BatchEvent, BatchProfile } from 'libs/react-native-batch'
import { storage } from 'libs/storage'
import {
  useBookingsByStatusQuery,
  useBookingsV2WithConvertedTimezoneQuery,
} from 'queries/bookings/useBookingsQuery'
import { createLabels } from 'shared/handleTooManyCount/countUtils'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

const checkBookingPage = async () => {
  const hasSeenBookingPage = await storage.readObject<boolean>('has_seen_booking_page')

  if (!hasSeenBookingPage) {
    await BatchProfile.trackEvent(BatchEvent.hasSeenBookingPage)
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

  const enableNewBookings = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_BOOKINGS_ENDED_ONGOING)

  const useBookingsByStatus = () =>
    useBookingsByStatusQuery(mapBookingsStatusToActiveTab[activeTab], {
      select: convertBookingsListResponseV2DatesToTimezone,
    })

  const useBookingsV2 = () =>
    useBookingsV2WithConvertedTimezoneQuery(
      convertBookingsResponseV2,
      mapBookingsToActiveTab[activeTab],
      true
    )

  const useActiveBookingsQuery = enableNewBookings ? useBookingsByStatus : useBookingsV2

  const { data: bookings } = useActiveBookingsQuery()

  const { mutateAsync: addReaction, isPending } = useReactionMutation()
  const { bookings: endedBookings = [] } = bookings ?? {}

  const { data: availableReactions } = useAvailableReactionQuery()
  const numberOfReactableBookings = availableReactions?.numberOfReactableBookings ?? 0

  const { fullCountLabel, accessibilityLabel } = createLabels(
    numberOfReactableBookings,
    'réservations'
  )

  const updateReactions = useCallback(async () => {
    if (isPending) return

    const reactableEndedBookings = endedBookings.filter(
      (endedBooking) => !!endedBooking.canReact && endedBooking.userReaction === null
    )

    const reactionRequest: PostReactionRequest = {
      reactions: reactableEndedBookings.map((booking) => ({
        offerId: booking.stock.offer.id,
        reactionType: ReactionTypeEnum.NO_REACTION,
      })),
    }

    if (reactionRequest.reactions.length) {
      await addReaction(reactionRequest)
    }
  }, [isPending, addReaction, endedBookings])

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
    [BookingsTab.CURRENT]: <OnGoingBookingsList useOngoingBookingsQuery={useActiveBookingsQuery} />,
    [BookingsTab.COMPLETED]: <EndedBookings useEndedBookingsQuery={useActiveBookingsQuery} />,
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
              ? { label: fullCountLabel, accessibilityLabel }
              : undefined,
          },
        ]}
        onTabChange={(key) => {
          if (activeTab === BookingsTab.COMPLETED) updateReactions()
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
