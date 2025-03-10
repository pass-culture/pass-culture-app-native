import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { OfferResponseV2 } from 'api/gen'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { ThumbUpFilled } from 'ui/svg/icons/ThumbUpFilled'
import { TypoDS, getSpacing } from 'ui/theme'

type Props = {
  offer: OfferResponseV2
}

export const OfferReactions: FunctionComponent<Props> = ({ offer }) => {
  const { reactionsCount } = offer
  const hasLikes = reactionsCount.likes > 0

  if (!hasLikes) return null

  return (
    <StyledView gap={1}>
      <StyledThumbUp testID="thumbUp" />
      <TypoDS.BodyAccentS>{reactionsCount?.likes} j’aime</TypoDS.BodyAccentS>
    </StyledView>
  )
}

const StyledThumbUp = styled(ThumbUpFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
  color: theme.colors.primary,
}))``

const StyledView = styled(ViewGap)({
  flexDirection: 'row',
  alignItems: 'end',
  paddingVertical: getSpacing(1),
})
