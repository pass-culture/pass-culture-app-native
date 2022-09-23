import React from 'react'
import styled from 'styled-components/native'

import { CategoryIdEnum, OfferResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { IconWithCaption, OfferCategory } from 'features/offer/atoms'
import { getOfferPrices } from 'features/offer/services/getOfferPrice'
import { useUserProfileInfo } from 'features/profile/api'
import { getDisplayPrice, getDisplayPriceWithDuoMention } from 'libs/parsers'
import { Duo } from 'ui/svg/icons/Duo'
import { OrderPrice } from 'ui/svg/icons/OrderPrice'
import { getSpacing, Spacer } from 'ui/theme'

type Props = { categoryId: CategoryIdEnum | null; label: string } & Pick<
  OfferResponse,
  'stocks' | 'isDuo'
>

export const OfferIconCaptions: React.FC<Props> = ({ isDuo, stocks, categoryId, label }) => {
  const { isLoggedIn } = useAuthContext()
  const { data: profileInfo } = useUserProfileInfo()
  if (isLoggedIn && !profileInfo) return <React.Fragment></React.Fragment>

  const { isBeneficiary = false } = profileInfo || {}
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
