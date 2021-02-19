import React from 'react'
import styled from 'styled-components/native'

import { CategoryType } from 'api/gen'
import { Booking } from 'ui/svg/icons/Booking'
import { Calendar } from 'ui/svg/icons/Calendar'
import { LocationBuilding } from 'ui/svg/icons/LocationBuilding'
import { OrderPrice } from 'ui/svg/icons/OrderPrice'
import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

import { useBooking } from '../pages/BookingOfferWrapper'

export const BookingInformations: React.FC = () => {
  const { bookingState } = useBooking()

  if (bookingState.category === CategoryType.Event) {
    return (
      <React.Fragment>
        <Item Icon={Booking} message="Marina Rollman, un spectacle drôle" />
        <Item Icon={Calendar} message="Samedi 18 mai 2021, 20:30" />
        <Item Icon={LocationBuilding} message="La Cigale, 120 Bld Rochechouart 75018 Paris" />
        <Item Icon={OrderPrice} message="48€" subtext="(24 € x 2 places)" />
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <Item Icon={Booking} message="Deezer premium 3/mois" />
      <Item Icon={OrderPrice} message="14,99€" />
    </React.Fragment>
  )
}

const Item: React.FC<{ Icon: React.FC<IconInterface>; message: string; subtext?: string }> = ({
  Icon,
  message,
  subtext = '',
}) => (
  <Row>
    <Icon color={ColorsEnum.GREY_DARK} />
    <Spacer.Row numberOfSpaces={2} />
    <Typo.Caption>{message}</Typo.Caption>
    <Spacer.Row numberOfSpaces={2} />
    <Typo.Caption color={ColorsEnum.GREY_DARK}>{subtext}</Typo.Caption>
  </Row>
)

const Row = styled.View({ flexDirection: 'row', alignItems: 'center' })
