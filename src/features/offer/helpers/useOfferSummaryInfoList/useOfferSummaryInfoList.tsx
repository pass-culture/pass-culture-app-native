import React from 'react'
import { useTheme } from 'styled-components/native'

import { OfferResponseV2 } from 'api/gen'
import { extractStockDates } from 'features/offer/helpers/extractStockDates/extractStockDates'
import { formatDuration } from 'features/offer/helpers/formatDuration/formatDuration'
import { capitalizeFirstLetter } from 'libs/parsers/capitalizeFirstLetter'
import { getFormattedDates } from 'libs/parsers/formatDates'
import { formatFullAddress } from 'shared/address/addressFormatter'
import { getOfferLocationName } from 'shared/offer/helpers/getOfferLocationName'
import { SummaryInfoProps } from 'ui/components/SummaryInfo'
import { CalendarS } from 'ui/svg/icons/CalendarS'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { Digital } from 'ui/svg/icons/Digital'
import { MapPin } from 'ui/svg/icons/MapPin'
import { Stock } from 'ui/svg/icons/Stock'

type Props = {
  offer: OfferResponseV2
  isCinemaOffer?: boolean
}

export type SummaryInfoItem = SummaryInfoProps & {
  isDisplayed?: boolean
}

export const useOfferSummaryInfoList = ({ offer, isCinemaOffer }: Props) => {
  const theme = useTheme()
  const { venue, isDigital, isDuo, extraData, address } = offer
  const dates = extractStockDates(offer)
  const formattedDate = capitalizeFirstLetter(getFormattedDates(dates))
  const locationName = getOfferLocationName(venue, isDigital)
  const duration = extraData?.durationMinutes
    ? formatDuration(extraData.durationMinutes)
    : undefined

  const fullAddressOffer = formatFullAddress(address?.street, address?.postalCode, address?.city)
  const fullAddressVenue = formatFullAddress(venue.address, venue.postalCode, venue.city)

  const summaryInfoItems: SummaryInfoItem[] = [
    {
      isDisplayed: !!fullAddressOffer && fullAddressOffer !== fullAddressVenue,
      Icon: <MapPin color={theme.designSystem.color.icon.default} size={theme.icons.sizes.small} />,
      title: address?.label ?? 'Adresse',
      subtitle: fullAddressOffer,
    },
    {
      isDisplayed: !!formattedDate && !isCinemaOffer,
      Icon: (
        <CalendarS color={theme.designSystem.color.icon.default} size={theme.icons.sizes.small} />
      ),
      title: 'Dates',
      subtitle: formattedDate,
    },
    {
      isDisplayed: isDigital,
      Icon: (
        <Digital color={theme.designSystem.color.icon.default} size={theme.icons.sizes.small} />
      ),
      title: 'En ligne',
      subtitle: locationName,
    },
    {
      isDisplayed: !!duration,
      Icon: (
        <ClockFilled color={theme.designSystem.color.icon.default} size={theme.icons.sizes.small} />
      ),
      title: 'Durée',
      subtitle: duration,
    },
    {
      isDisplayed: isDuo,
      Icon: <Stock color={theme.designSystem.color.icon.default} size={theme.icons.sizes.small} />,
      title: 'Duo',
      subtitle: 'Tu peux prendre deux places',
    },
  ]

  const displayedSummaryInfoItems = summaryInfoItems.filter((item) => item.isDisplayed)

  return { summaryInfoItems: displayedSummaryInfoItems }
}
