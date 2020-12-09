import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { useUserProfileInfo } from 'features/home/api'
import { AlgoliaHit } from 'libs/algolia'
import { _ } from 'libs/i18n'
import { getDisplayPrice } from 'libs/parsers'
import { Duo } from 'ui/svg/icons/Duo'
import { Euro } from 'ui/svg/icons/Euro'
import { ColorsEnum, getSpacing, Spacer } from 'ui/theme'

import { IconWithCaption, OfferCategory } from '../atoms'

export const OfferIconCaptions = ({ algoliaHit }: { algoliaHit: AlgoliaHit | undefined }) => {
  const { data: profileInfo } = useUserProfileInfo()
  const priceWithoutDuoMention = getDisplayPrice(algoliaHit?.offer.prices)
  const displayPriceDuoPrecision =
    algoliaHit?.offer.isDuo &&
    profileInfo?.isBeneficiary &&
    priceWithoutDuoMention !== 'Gratuit' &&
    priceWithoutDuoMention !== ''
  const displayedPrice = `${priceWithoutDuoMention}${
    displayPriceDuoPrecision ? ` ${_(t`/ place`)}` : ''
  }`

  if (!algoliaHit) return <React.Fragment />

  return (
    <Row>
      <Spacer.Row numberOfSpaces={6} />
      <OfferCategory
        category={algoliaHit?.offer.category || null}
        label={algoliaHit?.offer.label}
      />
      {algoliaHit.offer.isDuo && profileInfo?.isBeneficiary && (
        <React.Fragment>
          <Separator />
          <IconWithCaption testID="iconDuo" Icon={Duo} caption={_(t`À deux !`)} />
        </React.Fragment>
      )}
      <Separator />
      <IconWithCaption testID="iconEuro" Icon={Euro} caption={displayedPrice} />
      <Spacer.Row numberOfSpaces={6} />
    </Row>
  )
}

const Row = styled.View({ flexDirection: 'row' })

const Separator = styled.View({
  width: 1,
  backgroundColor: ColorsEnum.GREY_MEDIUM,
  marginHorizontal: getSpacing(2),
})
