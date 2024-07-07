import React from 'react'
import styled from 'styled-components/native'

import { OnGoingBookingsList } from 'features/bookings/components/OnGoingBookingsList'
import { EndedBookings } from 'features/bookings/pages/EndedBookings/EndedBookings'
import { TabLayout } from 'features/venue/components/TabLayout/TabLayout'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

enum Tab {
  CURRENT = 'En cours',
  COMPLETED = 'Terminées',
}

export function Bookings() {
  const enableBookingImprove = useFeatureFlag(RemoteStoreFeatureFlags.WIP_BOOKING_IMPROVE)
  const tabPanels = {
    [Tab.CURRENT]: <OnGoingBookingsList enableBookingImprove={enableBookingImprove} />,
    [Tab.COMPLETED]: <EndedBookings enableBookingImprove={enableBookingImprove} />,
  }
  return (
    <React.Fragment>
      {enableBookingImprove ? (
        <ContainerTab gap={6}>
          <PageHeader title="Mes réservations" />
          <TabLayout
            tabPanels={tabPanels}
            defaultTab={Tab.CURRENT}
            tabs={[{ key: Tab.CURRENT }, { key: Tab.COMPLETED }]}
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
