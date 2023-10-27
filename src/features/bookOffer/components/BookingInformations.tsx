import React from 'react'
import styled from 'styled-components/native'

import { formatDate } from 'features/bookOffer/components/CancellationDetails'
import { PriceLine } from 'features/bookOffer/components/PriceLine'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { useBookingOffer } from 'features/bookOffer/helpers/useBookingOffer'
import { useBookingStock } from 'features/bookOffer/helpers/useBookingStock'
import { formatFullAddressWithVenueName } from 'libs/address/useFormatFullAddress'
import { formatToFrenchDate } from 'libs/parsers/formatDates'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { Booking } from 'ui/svg/icons/Booking'
import { Calendar } from 'ui/svg/icons/Calendar'
import { LocationBuilding } from 'ui/svg/icons/LocationBuilding'
import { OrderPrice } from 'ui/svg/icons/OrderPrice'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Spacer, Typo } from 'ui/theme'

const ExpirationDate: React.FC<{
  expirationDate: string | undefined | null
}> = ({ expirationDate }) => {
  if (!expirationDate) return <React.Fragment></React.Fragment>

  const activationText = `À activer avant le ${formatToFrenchDate(expirationDate)}`

  return <Item Icon={Calendar} message={activationText} />
}

interface Props {
  shouldDisplayAddress?: boolean
}

export const BookingInformations = ({ shouldDisplayAddress = true }: Props) => {
  const { bookingState } = useBookingContext()
  const offer = useBookingOffer()
  const stock = useBookingStock()
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
  const price =
    stock.price > 0 ? (
      <PriceLine
        unitPrice={stock.price}
        label={stock.priceCategoryLabel}
        quantity={quantity}
        attributes={stock.features}
      />
    ) : (
      'Gratuit'
    )

  if (mapping[offer.subcategoryId].isEvent) {
    return (
      <React.Fragment>
        <Item Icon={Booking} message={name} />
        {!!stock.beginningDatetime && (
          <Item
            Icon={Calendar}
            message={formatDate(stock.beginningDatetime, offer.venue.timezone)}
          />
        )}
        {!!shouldDisplayAddress && (
          <Item Icon={LocationBuilding} message={address} testID="address" />
        )}
        <Item Icon={OrderPrice} message={price} />
      </React.Fragment>
    )
  }

  if (!isDigital) {
    return (
      <React.Fragment>
        <Item Icon={Booking} message={name} />
        {!!shouldDisplayAddress && (
          <Item Icon={LocationBuilding} message={address} testID="address" />
        )}
        <Item Icon={OrderPrice} message={price} />
      </React.Fragment>
    )
  }

  const expirationDate = stock?.activationCode?.expirationDate

  return (
    <React.Fragment>
      <Item Icon={Booking} message={name} />
      <Item Icon={OrderPrice} message={price} />
      <ExpirationDate expirationDate={expirationDate} />
    </React.Fragment>
  )
}

const Item: React.FC<{
  Icon: React.FC<IconInterface>
  message: React.JSX.Element | string
  subtext?: string
  testID?: string
}> = ({ Icon, message, subtext = '', testID }) => {
  const StyledIcon = styled(Icon).attrs(({ theme }) => ({
    color: theme.colors.greyDark,
    size: theme.icons.sizes.small,
  }))``
  return (
    <Row testID={testID}>
      <IconWrapper>
        <StyledIcon />
      </IconWrapper>
      <Spacer.Row numberOfSpaces={3} />
      {typeof message === 'string' ? <Typo.Caption>{message}</Typo.Caption> : message}
      <Spacer.Row numberOfSpaces={2} />
      <Typo.CaptionNeutralInfo>{subtext}</Typo.CaptionNeutralInfo>
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
