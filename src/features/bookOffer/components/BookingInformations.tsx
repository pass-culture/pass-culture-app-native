import React from 'react'
import { Dimensions } from 'react-native'
import styled from 'styled-components/native'

import { CategoryType } from 'api/gen'
import { useOffer } from 'features/offer/api/useOffer'
import { Booking } from 'ui/svg/icons/Booking'
import { Calendar } from 'ui/svg/icons/Calendar'
import { LocationBuilding } from 'ui/svg/icons/LocationBuilding'
import { OrderPrice } from 'ui/svg/icons/OrderPrice'
import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

import { useBooking } from '../pages/BookingOfferWrapper'

import { formatDate } from './CancellationDetails'

const { width } = Dimensions.get('window')

export const BookingInformations: React.FC = () => {
  const { bookingState } = useBooking()
  const { data: offer } = useOffer({ offerId: bookingState.offerId || 0 })

  if (!offer) return <React.Fragment />

  const { category, isDigital, fullAddress, name, stocks = [] } = offer
  const stock = stocks.find(({ id }) => id === bookingState.stockId)
  if (!stock) return <React.Fragment />

  const address = (
    <StyledAddress>
      <Typo.Caption>{fullAddress}</Typo.Caption>
    </StyledAddress>
  )

  if (category.categoryType === CategoryType.Event) {
    return (
      <React.Fragment>
        <Item Icon={Booking} message={name} />
        {stock.beginningDatetime && (
          <Item Icon={Calendar} message={formatDate(stock.beginningDatetime)} />
        )}
        <Item Icon={LocationBuilding} message={address} />
        <Item Icon={OrderPrice} message="48€" subtext="(24 € x 2 places)" />
      </React.Fragment>
    )
  }

  if (!isDigital) {
    return (
      <React.Fragment>
        <Item Icon={Booking} message={name} />
        <Item Icon={LocationBuilding} message={address} />
        <Item Icon={OrderPrice} message="14,99€" />
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <Item Icon={Booking} message={name} />
      <Item Icon={OrderPrice} message="14,99€" />
    </React.Fragment>
  )
}

const Item: React.FC<{
  Icon: React.FC<IconInterface>
  message: Element | string
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
})
const StyledAddress = styled(Typo.Body)({
  textTransform: 'capitalize',
})
