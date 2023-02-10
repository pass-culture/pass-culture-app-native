import React from 'react'
import styled from 'styled-components/native'

import { OfferTypes } from 'features/search/types'
import { Li } from 'ui/components/Li'
import { ShareMessagingApp, Network } from 'ui/components/ShareMessagingApp'
import { ShareMessagingAppOther } from 'ui/components/ShareMessagingAppOther'
import { Ul } from 'ui/components/Ul'
import { getSpacing, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type MessagingAppsProps = {
  offerType: OfferTypes
  socialMedias: Network[]
}

export const MessagingApps = ({ offerType, socialMedias }: MessagingAppsProps) => {
  const title =
    offerType === 'isEvent' ? 'Vas-y en bande organisée\u00a0!' : 'Partage ce bon plan\u00a0!'
  return (
    <React.Fragment>
      <StyledTitle4>{title}</StyledTitle4>
      <IconsWrapper>
        <StyledUl>
          {/* TODO(PC-19359): use InstalledMessagingApps here */}
          {socialMedias.map((socialMedia) => (
            <StyledLi key={socialMedia}>
              <ShareMessagingApp
                network={socialMedia}
                onPress={async () => {
                  return
                }}
              />
            </StyledLi>
          ))}
          <StyledLi>
            <ShareMessagingAppOther
              onPress={async () => {
                return
              }}
            />
          </StyledLi>
        </StyledUl>
      </IconsWrapper>
    </React.Fragment>
  )
}

const IconsWrapper = styled.View(({ theme }) => ({
  flexDirection: 'row',
  width: '100%',
  maxWidth: theme.contentPage.maxWidth,
}))

const StyledUl = styled(Ul)({
  flex: 1,
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: getSpacing(2),
})

const StyledTitle4 = styled(Typo.Title4).attrs(getHeadingAttrs(2))({
  paddingTop: getSpacing(6),
  paddingBottom: getSpacing(4),
})

const StyledLi = styled(Li)({
  width: getSpacing(19),
  height: getSpacing(24),
})
