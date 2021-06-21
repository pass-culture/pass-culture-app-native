import { t } from '@lingui/macro'
import React from 'react'
import { Dimensions } from 'react-native'
import styled from 'styled-components/native'

import { CategoryType } from 'api/gen'
import { useAppSettings } from 'features/auth/settings'
import { formatToFrenchDecimal } from 'libs/parsers'
import { formatToFrenchDate } from 'libs/parsers/formatDates'
import { Booking } from 'ui/svg/icons/Booking'
import { Calendar } from 'ui/svg/icons/Calendar'
import { LocationBuilding } from 'ui/svg/icons/LocationBuilding'
import { OrderPrice } from 'ui/svg/icons/OrderPrice'
import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

import { useBooking, useBookingOffer, useBookingStock } from '../pages/BookingOfferWrapper'

import { formatDate } from './CancellationDetails'

const { width } = Dimensions.get('window')

const ExpirationDate: React.FC<{
  autoActivateDigitalBookings: boolean | undefined
  expirationDate: Date | undefined
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

  const { quantity } = bookingState

  if (!offer) return <React.Fragment />

  const { category, isDigital, fullAddress, name } = offer
  if (!stock || typeof quantity !== 'number') return <React.Fragment />

  const address = (
    <StyledAddress>
      <Typo.Caption>{fullAddress}</Typo.Caption>
    </StyledAddress>
  )
  const price = stock.price > 0 ? formatToFrenchDecimal(quantity * stock.price) : t`Gratuit`

  if (category.categoryType === CategoryType.Event) {
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
}> = ({ Icon, message, subtext = '' }) => (
  <Row>
    <Icon color={ColorsEnum.GREY_DARK} />
    <Spacer.Row numberOfSpaces={2} />
    {typeof message === 'string' ? <Typo.Caption>{message}</Typo.Caption> : message}
    <Spacer.Row numberOfSpaces={2} />
    <Typo.Caption color={ColorsEnum.GREY_DARK}>{subtext}</Typo.Caption>
  </Row>
)

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  width: width - getSpacing(4 * 6),
  paddingVertical: getSpacing(0.5),
})
const StyledAddress = styled(Typo.Body)({
  textTransform: 'capitalize',
  alignItems: 'center',
})
