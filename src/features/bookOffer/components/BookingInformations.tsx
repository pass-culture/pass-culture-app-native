import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { Item } from 'features/bookings/components/BookingItemWithIcon'
import { CinemaScreeningDetail } from 'features/bookings/components/CinemaScreeningDetailsModal/types'
import { PriceLine } from 'features/bookOffer/components/PriceLine'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { getScreeningDetails } from 'features/bookOffer/helpers/getScreeningDetails'
import { CINEMA_SCREENING_ACCESSIBILITY_ENTRIES } from 'features/offer/components/CinemaScreeningCard/constants'
import { formatDuration } from 'features/offer/helpers/formatDuration/formatDuration'
import { formatToCompleteFrenchDateTime, formatToFrenchDate } from 'libs/parsers/formatDates'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { useBookingOfferQuery } from 'queries/offer/useBookingOfferQuery'
import { useOfferStockScreeningFeaturesQuery } from 'queries/offer/useOfferStockScreeningFeaturesQuery'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { TagVariant } from 'ui/designSystem/Tag/types'
import { Booking } from 'ui/svg/icons/Booking'
import { Calendar } from 'ui/svg/icons/Calendar'
import { OrderPrice } from 'ui/svg/icons/OrderPrice'
import { Vitrine } from 'ui/svg/icons/Vitrine'

const ExpirationDate: React.FC<{
  expirationDate: string | undefined | null
}> = ({ expirationDate }) => {
  if (!expirationDate) return null

  const activationText = `À activer avant le ${formatToFrenchDate(new Date(expirationDate))}`

  return <Item Icon={Calendar} message={activationText} />
}

export const BookingInformations = () => {
  const { bookingState } = useBookingContext()
  const offer = useBookingOfferQuery()
  const { data: stock } = useOfferStockScreeningFeaturesQuery(
    bookingState.offerId,
    bookingState.stockId
  )
  const mapping = useSubcategoriesMapping()
  const { quantity } = bookingState

  if (!stock || typeof quantity !== 'number' || !offer) return null

  const screeningDetails = getScreeningDetails(stock.screeningFeatures)
  const language = stock.screeningFeatures?.language
  const { isDigital, name } = offer

  const price =
    stock.price > 0 ? (
      <PriceLine
        unitPrice={stock.price}
        label={stock.priceCategoryLabel}
        quantity={quantity}
        attributes={language ? [language] : []}
      />
    ) : (
      'Gratuit'
    )

  if (mapping[offer.subcategoryId].isEvent) {
    let message = stock.beginningDatetime
      ? formatToCompleteFrenchDateTime({
          date: new Date(stock.beginningDatetime),
          shouldDisplayWeekDay: true,
        })
      : ''

    if (offer.extraData?.durationMinutes) {
      message += ` - Durée\u00a0: ${formatDuration(offer.extraData.durationMinutes).label}`
    }

    return (
      <React.Fragment>
        <Item Icon={Booking} message={name} />
        {stock.beginningDatetime ? <Item Icon={Calendar} message={message} /> : null}
        <Item Icon={OrderPrice} message={price} />
        {screeningDetails.length > 0 ? (
          <Item Icon={Vitrine} message={<ScreeningTags details={screeningDetails} />} />
        ) : null}
      </React.Fragment>
    )
  }

  if (!isDigital) {
    return (
      <React.Fragment>
        <Item Icon={Booking} message={name} />
        <Item Icon={OrderPrice} message={price} />
      </React.Fragment>
    )
  }

  const expirationDate = stock.activationCode?.expirationDate

  return (
    <React.Fragment>
      <Item Icon={Booking} message={name} />
      <Item Icon={OrderPrice} message={price} />
      <ExpirationDate expirationDate={expirationDate} />
    </React.Fragment>
  )
}

const ScreeningTags = ({ details }: { details: CinemaScreeningDetail[] }) => {
  const { designSystem } = useTheme()
  const accessibilityIcons = CINEMA_SCREENING_ACCESSIBILITY_ENTRIES.filter(({ key }) =>
    details.some((detail) => detail.type === 'accessibility' && detail.category === key)
  )

  return (
    <TagsRow>
      {details.map((detail, index) =>
        detail.type === 'tag' ? (
          <Tag
            key={`${detail.category}-${detail.label}-${index}`}
            label={detail.label}
            variant={
              detail.category === 'special-event' ? TagVariant.HIGHLIGHT : TagVariant.DEFAULT
            }
          />
        ) : null
      )}
      {accessibilityIcons.map(({ key, Icon, label }) => (
        <Icon
          key={key}
          size={designSystem.size.icon.s}
          color={designSystem.color.icon.brandPrimary}
          accessibilityLabel={label}
        />
      ))}
    </TagsRow>
  )
}

const TagsRow = styled.View(({ theme }) => ({
  flex: 1,
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.designSystem.size.spacing.xs,
}))
