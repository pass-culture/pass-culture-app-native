import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { useFreeEventsQuery } from 'features/generalPublicHome/queries/useFreeEventsQuery'
import { HitPlaceholder } from 'ui/components/placeholders/Placeholders'
import { HorizontalOfferTile } from 'ui/components/tiles/HorizontalOfferTile'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { Spacer } from 'ui/theme'

const ANALYTICS_PARAMS = { from: 'aroundme' as const }
const PLACEHOLDERS_COUNT = 3

// The venue map isn't available on web: free events around the user are listed instead
export const GeneralPublicMap: FunctionComponent = () => {
  const { offers, isLoading } = useFreeEventsQuery({ dateFilter: null })

  const renderContent = () => {
    if (isLoading) {
      return Array.from({ length: PLACEHOLDERS_COUNT }, (_, index) => (
        <HitPlaceholder key={index} />
      ))
    }
    if (offers.length === 0) {
      return <Banner label="Aucune offre gratuite autour de toi pour le moment." />
    }
    return offers.map((offer, index) => (
      <HorizontalOfferTile
        key={offer.objectID}
        offer={offer}
        analyticsParams={{ ...ANALYTICS_PARAMS, index }}
      />
    ))
  }

  return (
    <PageWithHeader
      title="Autour de toi"
      shouldDisplayBackButton={false}
      scrollChildren={
        <React.Fragment>
          <List>{renderContent()}</List>
          <Spacer.TabBar />
        </React.Fragment>
      }
    />
  )
}

const List = styled.View(({ theme }) => ({
  gap: theme.designSystem.size.spacing.l,
}))
