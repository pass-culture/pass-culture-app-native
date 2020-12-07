import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { useUserProfileInfo } from 'features/home/api'
import { AlgoliaHit } from 'libs/algolia'
import { _ } from 'libs/i18n'
import { Duo } from 'ui/svg/icons/Duo'
import { ColorsEnum, getSpacing, Spacer } from 'ui/theme'

import { IconWithCaption, OfferCategory } from '../atoms'

export const OfferIconCaptions = ({ algoliaHit }: { algoliaHit: AlgoliaHit | undefined }) => {
  const { data: profileInfo } = useUserProfileInfo()
  if (!algoliaHit) return <React.Fragment />

  return (
    <Row>
      <Spacer.Row numberOfSpaces={6} />
      <OfferCategory
        category={algoliaHit?.offer.category || null}
        label={algoliaHit?.offer.label}
      />
      {algoliaHit.offer.isDuo && profileInfo?.is_beneficiary && (
        <React.Fragment>
          <Separator />
          <IconWithCaption testID="iconDuo" Icon={Duo} caption={_(t`À deux !`)} />
        </React.Fragment>
      )}
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
