import React from 'react'
import styled from 'styled-components/native'

import { OfferTypes } from 'features/search/types'
import { ShareMessagingApp } from 'ui/components/ShareMessagingApp'
import { Network } from 'ui/components/ShareMessagingApp'
import { ShareMessagingAppOther } from 'ui/components/ShareMessagingAppOther'
import { getSpacing, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type MessagingAppsProps = {
  offerType: OfferTypes
  media: Network[]
}

export const MessagingApps: React.FC<MessagingAppsProps> = ({ offerType, media }) => {
  const title =
    offerType === 'isEvent' ? 'Vas-y en bande organisée\u00a0!' : 'Partage ce bon plan\u00a0!'
  return (
    <React.Fragment>
      <StyledTitle4>{title}</StyledTitle4>
      <IconsWrapper>
        <ShareMessagingApp network={media[0]} />
        <ShareMessagingApp network={Network.tiktok} />
        <ShareMessagingApp network={Network.snapchat} />
        <ShareMessagingAppOther />
      </IconsWrapper>
    </React.Fragment>
  )
}

const IconsWrapper = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
})

const StyledTitle4 = styled(Typo.Title4).attrs(getHeadingAttrs(2))({
  paddingTop: getSpacing(4),
  paddingBottom: getSpacing(4),
})
