import React from 'react'
import styled from 'styled-components/native'

import { InstalledMessagingApps } from 'features/offer/components/shareMessagingOffer/InstalledMessagingApps'
import { Li } from 'ui/components/Li'
import { ShareMessagingAppOther } from 'ui/components/ShareMessagingAppOther'
import { Ul } from 'ui/components/Ul'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type MessagingAppsProps = {
  isEvent: boolean
}

export const MessagingApps = ({ isEvent }: MessagingAppsProps) => {
  const title = isEvent ? 'Vas-y en bande organisée\u00a0!' : 'Partage ce bon plan\u00a0!'
  return (
    <React.Fragment>
      <StyledTitle4>{title}</StyledTitle4>
      <IconsWrapper>
        <StyledUl>
          <InstalledMessagingApps />
          <StyledLi>
            <ShareMessagingAppOther
              onPress={async () => {
                return
              }}
            />
          </StyledLi>
        </StyledUl>
      </IconsWrapper>
      <Spacer.Column numberOfSpaces={9} />
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
