import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { useAppSettings } from 'features/auth/settings'
import { formatFullAddressWithVenueName } from 'libs/address/useFormatFullAddress'
import { formatToFrenchDecimal } from 'libs/parsers'
import { formatToFrenchDate } from 'libs/parsers/formatDates'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { Booking } from 'ui/svg/icons/Booking'
import { Calendar } from 'ui/svg/icons/Calendar'
import { LocationBuilding } from 'ui/svg/icons/LocationBuilding'
import { OrderPrice } from 'ui/svg/icons/OrderPrice'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { useBooking, useBookingOffer, useBookingStock } from '../pages/BookingOfferWrapper'

import { formatDate } from './CancellationDetails'

const ExpirationDate: React.FC<{
  autoActivateDigitalBookings: boolean | undefined
  expirationDate: string | undefined | null
}> = ({ autoActivateDigitalBookings, expirationDate }) => {
  if (!autoActivateDigitalBookings || !expirationDate) return <React.Fragment></React.Fragment>

  const activationText = t({
    id: 'activation message',
    values: { date: formatToFrenchDate(expirationDate) },
    message: 'À activer avant le {date}',
  })

  return <Item Icon={Calendar} message={activationText} />
}

export const BookingInformations: React.FC = () => {
  const { bookingState } = useBooking()
  const offer = useBookingOffer()
  const stock = useBookingStock()
  const { data: settings } = useAppSettings()
  const mapping = useSubcategoriesMapping()

  const { quantity } = bookingState

  if (!stock || typeof quantity !== 'number' || !offer) return <React.Fragment />

  const { isDigital, name, venue } = offer
  const fullAddress = formatFullAddressWithVenueName(
    venue.address,
    venue.postalCode,
    venue.city,
    venue.publicName,
    venue.name
  )

  const address = (
    <StyledAddress>
      <Typo.Caption>{fullAddress}</Typo.Caption>
    </StyledAddress>
  )
  const price = stock.price > 0 ? formatToFrenchDecimal(quantity * stock.price) : t`Gratuit`

  if (mapping[offer.subcategoryId].isEvent) {
    const subtext =
      stock.price > 0 && quantity === 2
        ? t({
            id: 'prix duo',
            values: { price: formatToFrenchDecimal(stock.price) },
            message: '({price} x 2 places)',
          })
        : undefined

    return (
      <React.Fragment>
        <Item Icon={Booking} message={name} />
        {!!stock.beginningDatetime && (
          <Item Icon={Calendar} message={formatDate(stock.beginningDatetime)} />
        )}
        <Item Icon={LocationBuilding} message={address} />
        <Item Icon={OrderPrice} message={price} subtext={subtext} />
      </React.Fragment>
    )
  }

  if (!isDigital) {
    return (
      <React.Fragment>
        <Item Icon={Booking} message={name} />
        <Item Icon={LocationBuilding} message={address} />
        <Item Icon={OrderPrice} message={price} />
      </React.Fragment>
    )
  }

  const expirationDate = stock?.activationCode?.expirationDate

  return (
    <React.Fragment>
      <Item Icon={Booking} message={name} />
      <Item Icon={OrderPrice} message={price} />
      <ExpirationDate
        autoActivateDigitalBookings={settings?.autoActivateDigitalBookings}
        expirationDate={expirationDate}
      />
    </React.Fragment>
  )
}

const Item: React.FC<{
  Icon: React.FC<IconInterface>
  message: JSX.Element | string
  subtext?: string
}> = ({ Icon, message, subtext = '' }) => {
  const StyledIcon = styled(Icon).attrs(({ theme }) => ({
    color: theme.colors.greyDark,
    size: theme.icons.sizes.small,
  }))``
  return (
    <Row>
      <IconWrapper>
        <StyledIcon />
      </IconWrapper>
      <Spacer.Row numberOfSpaces={3} />
      {typeof message === 'string' ? <Typo.Caption>{message}</Typo.Caption> : message}
      <Spacer.Row numberOfSpaces={2} />
      <StyledCaption>{subtext}</StyledCaption>
    </Row>
  )
}

const Row = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  width: theme.appContentWidth - getSpacing(24),
  paddingVertical: getSpacing(0.5),
}))
const IconWrapper = styled.View({
  flexShrink: 0,
})
const StyledAddress = styled(Typo.Body)({
  textTransform: 'capitalize',
  alignItems: 'center',
})
const StyledCaption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
