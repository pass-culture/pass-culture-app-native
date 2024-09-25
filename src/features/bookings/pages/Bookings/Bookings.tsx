import { useFocusEffect, useRoute } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components/native'

import { ReactionTypeEnum } from 'api/gen'
import { useBookings } from 'features/bookings/api'
import { OnGoingBookingsList } from 'features/bookings/components/OnGoingBookingsList'
import { BookingsTab } from 'features/bookings/enum'
import { EndedBookings } from 'features/bookings/pages/EndedBookings/EndedBookings'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useReactionMutation } from 'features/reactions/api/useReactionMutation'
import { TabLayout } from 'features/venue/components/TabLayout/TabLayout'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

export function Bookings() {
  const { params } = useRoute<UseRouteType<'Bookings'>>()
  const enableBookingImprove = useFeatureFlag(RemoteStoreFeatureFlags.WIP_BOOKING_IMPROVE)
  const [activeTab, setActiveTab] = useState<BookingsTab>(params?.activeTab ?? BookingsTab.CURRENT)
  const [previousTab, setPreviousTab] = useState(activeTab)
  const { data: bookings } = useBookings()
  const { mutate: addReaction } = useReactionMutation()

  const updateReactions = useCallback(() => {
    const bookingsToUpdate =
      bookings?.ended_bookings
        .filter((ended_booking) => ended_booking.userReaction === null)
        .map((booking) => booking.stock.offer.id) ?? []

    const mutationPayload = bookingsToUpdate.map((bookingId) => ({
      offerId: bookingId,
      reactionType: ReactionTypeEnum.NO_REACTION,
    }))
    if (mutationPayload.length > 0) {
      addReaction({ reactions: mutationPayload })
    }
  }, [addReaction, bookings?.ended_bookings])

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (previousTab === BookingsTab.COMPLETED) {
          updateReactions()
        }
        setPreviousTab(activeTab)
      }
    }, [activeTab, previousTab, updateReactions])
  )

  const tabPanels = {
    [BookingsTab.CURRENT]: <OnGoingBookingsList enableBookingImprove={enableBookingImprove} />,
    [BookingsTab.COMPLETED]: (
      <EndedBookings enableBookingImprove={enableBookingImprove} bookings={bookings} />
    ),
  }

  return (
    <React.Fragment>
      {enableBookingImprove ? (
        <ContainerTab gap={6}>
          <PageHeader title="Mes réservations" />
          <TabLayout
            tabPanels={tabPanels}
            defaultTab={params?.activeTab ?? BookingsTab.CURRENT}
            tabs={[{ key: BookingsTab.CURRENT }, { key: BookingsTab.COMPLETED }]}
            onTabChange={(key) => {
              setActiveTab(key)
            }}
          />
        </ContainerTab>
      ) : (
        <Container>
          <PageHeader title="Mes réservations" />
          <OnGoingBookingsList enableBookingImprove={enableBookingImprove} />
        </Container>
      )}
    </React.Fragment>
  )
}

const ContainerTab = styled(ViewGap)({ flex: 1 })
const Container = styled.View({ flex: 1 })
