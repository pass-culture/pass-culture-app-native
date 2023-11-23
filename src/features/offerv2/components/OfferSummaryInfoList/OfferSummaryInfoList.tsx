import React from 'react'
import { useTheme } from 'styled-components/native'

import { OfferResponse } from 'api/gen'
import { extractStockDates } from 'features/offer/helpers/extractStockDates/extractStockDates'
import { formatDuration } from 'features/offerv2/helpers/formatDuration/formatDuration'
import { capitalizeFirstLetter, getFormattedDates } from 'libs/parsers'
import { getOfferLocationName } from 'shared/offer/helpers/getOfferLocationName'
import { Separator } from 'ui/components/Separator'
import { SummaryInfo, SummaryInfoProps } from 'ui/components/SummaryInfo'
import { CalendarS } from 'ui/svg/icons/CalendarS'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { Digital } from 'ui/svg/icons/Digital'
import { Stock } from 'ui/svg/icons/Stock'

type Props = {
  offer: OfferResponse
}

type SummaryInfoItem = SummaryInfoProps & {
  isDisplayed: boolean
}

export function OfferSummaryInfoList({ offer }: Readonly<Props>) {
  const theme = useTheme()
  const { venue, isDigital, isDuo, extraData } = offer
  const isPermanentVenue = venue.isPermanent
  const dates = extractStockDates(offer)
  const formattedDate = capitalizeFirstLetter(getFormattedDates(dates))
  const locationName = getOfferLocationName(venue, isDigital)
  const duration = extraData?.durationMinutes
    ? formatDuration(extraData.durationMinutes)
    : undefined

  const summaryInfoItems: SummaryInfoItem[] = [
    {
      isDisplayed: !!formattedDate,
      Icon: <CalendarS size={theme.icons.sizes.small} />,
      title: 'Dates',
      subtitle: formattedDate,
    },
    {
      isDisplayed: isDigital,
      Icon: <Digital size={theme.icons.sizes.small} />,
      title: 'En ligne',
      subtitle: locationName,
    },
    {
      isDisplayed: !!duration,
      Icon: <ClockFilled size={theme.icons.sizes.small} />,
      title: 'Durée',
      subtitle: duration,
    },
    {
      isDisplayed: isDuo,
      Icon: <Stock size={theme.icons.sizes.small} />,
      title: 'Duo',
      subtitle: 'Tu peux prendre deux places',
    },
  ]

  return (
    <React.Fragment>
      {!isPermanentVenue ? <Separator.Horizontal testID="topSeparator" /> : null}
      {summaryInfoItems.map(({ isDisplayed, Icon, title, subtitle }) =>
        isDisplayed ? (
          <SummaryInfo key={title} Icon={Icon} title={title} subtitle={subtitle} />
        ) : null
      )}
    </React.Fragment>
  )
}
