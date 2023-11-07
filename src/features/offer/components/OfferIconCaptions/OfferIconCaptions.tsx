import React from 'react'
import styled from 'styled-components/native'

import { CategoryIdEnum, OfferResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { OfferCategory } from 'features/offer/components/OfferCategory/OfferCategory'
import { getOfferPrices } from 'features/offer/helpers/getOfferPrice/getOfferPrice'
import { getDisplayPrice, getDisplayPriceWithDuoMention } from 'libs/parsers'
import { IconWithCaption } from 'ui/components/IconWithCaption'
import { Duo } from 'ui/svg/icons/Duo'
import { OrderPrice } from 'ui/svg/icons/OrderPrice'
import { getSpacing, Spacer } from 'ui/theme'

type Props = { categoryId: CategoryIdEnum | null; label: string } & Pick<
  OfferResponse,
  'stocks' | 'isDuo'
>

export const OfferIconCaptions: React.FC<Props> = ({ isDuo, stocks, categoryId, label }) => {
  const { isLoggedIn, user: profileInfo } = useAuthContext()
  if (isLoggedIn && !profileInfo) return null

  const { isBeneficiary = false } = profileInfo ?? {}
  const showDuo = isDuo && isBeneficiary

  const prices = getOfferPrices(stocks)
  const formattedPrice =
    isDuo && isBeneficiary ? getDisplayPriceWithDuoMention(prices) : getDisplayPrice(prices)

  return (
    <Row>
      <Spacer.Row numberOfSpaces={6} />
      <OfferCategory categoryId={categoryId} label={label} />
      {!!showDuo && (
        <React.Fragment>
          <Separator />
          <IconWithCaption
            testID="iconDuo"
            Icon={Duo}
            accessibilityLabel="Offre à deux"
            caption="À deux&nbsp;!"
          />
        </React.Fragment>
      )}
      <Separator />
      <IconWithCaption
        testID="iconPrice"
        Icon={OrderPrice}
        accessibilityLabel="Prix"
        caption={formattedPrice}
      />
      <Spacer.Row numberOfSpaces={6} />
    </Row>
  )
}

const Row = styled.View({ flexDirection: 'row', alignItems: 'flex-start' })

const Separator = styled.View(({ theme }) => ({
  width: 1,
  height: '92%',
  backgroundColor: theme.colors.greyMedium,
  marginHorizontal: getSpacing(2),
  alignSelf: 'center',
}))
