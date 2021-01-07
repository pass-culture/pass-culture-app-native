import { t } from '@lingui/macro'
import React, { Fragment } from 'react'
import styled from 'styled-components/native'

import { CategoryNameEnum, OfferResponse } from 'api/gen'
import { useUserProfileInfo } from 'features/home/api'
import { _ } from 'libs/i18n'
import { getDisplayPrice, getDisplayPriceWithDuoMention } from 'libs/parsers'
import { Duo } from 'ui/svg/icons/Duo'
import { OrderPrice } from 'ui/svg/icons/OrderPrice'
import { ColorsEnum, getSpacing, Spacer } from 'ui/theme'

import { IconWithCaption, OfferCategory } from '../atoms'
import { getOfferPrices } from '../services/getOfferPrice'

type Props = { category: CategoryNameEnum | null; label: string } & Pick<
  OfferResponse,
  'stocks' | 'isDuo'
>
export const OfferIconCaptions: React.FC<Props> = ({ isDuo, stocks, category, label }) => {
  const { data: profileInfo } = useUserProfileInfo()
  if (!profileInfo) return <Fragment></Fragment>

  const prices = getOfferPrices(stocks)
  const formattedPrice =
    isDuo && profileInfo.isBeneficiary
      ? getDisplayPriceWithDuoMention(prices)
      : getDisplayPrice(prices)

  return (
    <Row>
      <Spacer.Row numberOfSpaces={6} />
      <OfferCategory category={category} label={label} />
      {isDuo && profileInfo.isBeneficiary && (
        <React.Fragment>
          <Separator />
          <IconWithCaption testID="iconDuo" Icon={Duo} caption={_(t`À deux !`)} />
        </React.Fragment>
      )}
      <Separator />
      <IconWithCaption testID="iconPrice" Icon={OrderPrice} caption={formattedPrice} />
      <Spacer.Row numberOfSpaces={6} />
    </Row>
  )
}

const Row = styled.View({ flexDirection: 'row', alignItems: 'flex-start' })

const Separator = styled.View({
  width: 1,
  height: '100%',
  maxHeight: getSpacing(16),
  backgroundColor: ColorsEnum.GREY_MEDIUM,
  marginHorizontal: getSpacing(2),
})
