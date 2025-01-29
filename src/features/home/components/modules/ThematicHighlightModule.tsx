import { isBefore } from 'date-fns'
import React, { FunctionComponent, useEffect } from 'react'
import styled from 'styled-components/native'

import { computeDateRangeDisplay } from 'features/home/components/helpers/computeDateRangeDisplay'
import { MarketingBlockHighlight } from 'features/home/components/modules/marketing/MarketingBlockHighlight'
import { analytics } from 'libs/analytics/provider'
import { ContentTypes } from 'libs/contentful/types'

export type ThematicHighlightModuleProps = {
  id: string
  title: string
  subtitle?: string
  imageUrl: string
  beginningDate: Date
  endingDate: Date
  toThematicHomeEntryId: string
  index: number
  homeEntryId: string
}

export const ThematicHighlightModule: FunctionComponent<ThematicHighlightModuleProps> = ({
  id,
  title,
  subtitle,
  imageUrl,
  beginningDate,
  endingDate,
  toThematicHomeEntryId,
  index,
  homeEntryId,
}) => {
  const isAlreadyEnded = isBefore(endingDate, new Date())
  const shouldHideModule = isAlreadyEnded

  useEffect(() => {
    !shouldHideModule &&
      analytics.logModuleDisplayedOnHomepage({
        moduleId: id,
        moduleType: ContentTypes.THEMATIC_HIGHLIGHT,
        index,
        homeEntryId,
      })
    // should send analytics event only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (shouldHideModule) return null

  const dateRange = computeDateRangeDisplay(beginningDate, endingDate)

  const sendAnalyticsOnPress = () =>
    analytics.logHighlightBlockClicked({
      moduleId: id,
      entryId: homeEntryId,
      toEntryId: toThematicHomeEntryId,
    })

  return (
    <Container testID="new-highlight-module-container">
      <MarketingBlockHighlight
        homeId={toThematicHomeEntryId}
        backgroundImageUrl={imageUrl}
        moduleId={id}
        title={title}
        subtitle={dateRange}
        label={subtitle}
        onBeforeNavigate={sendAnalyticsOnPress}
      />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  marginBottom: theme.home.spaceBetweenModules,
}))
