import React, { FunctionComponent } from 'react'
import { styled } from 'styled-components/native'

import { ArtistResponse } from 'api/gen'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { FastImage } from 'libs/resizing-image-on-demand/FastImage'
import { Avatar } from 'ui/components/Avatar/Avatar'
import { DefaultAvatar } from 'ui/components/Avatar/DefaultAvatar'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { RightFilled } from 'ui/svg/icons/RightFilled'
import { Typo } from 'ui/theme'

type Props = {
  artist: ArtistResponse
  navigateTo: InternalNavigationProps['navigateTo']
  onBeforeNavigate: () => void
}

export const OfferArtistItem: FunctionComponent<Props> = ({
  artist,
  navigateTo,
  onBeforeNavigate,
}) => {
  return (
    <InternalTouchableLink
      navigateTo={navigateTo}
      onBeforeNavigate={onBeforeNavigate}
      accessibilityLabel={`Voir l’artiste ${artist.name}`}>
      <Container gap={2}>
        <Avatar>
          {artist.image ? (
            <StyledImage
              url={artist.image}
              accessibilityRole={AccessibilityRole.IMAGE}
              accessibilityLabel="artist avatar"
            />
          ) : (
            <DefaultAvatar testID="defaultAvatar" />
          )}
        </Avatar>
        <SubContainer>
          <LabelContainer>
            <Typo.Button>{artist.name}</Typo.Button>
          </LabelContainer>
          <StyledRightFilled />
        </SubContainer>
      </Container>
    </InternalTouchableLink>
  )
}

const Container = styled(ViewGap)({
  flexDirection: 'row',
  alignItems: 'center',
})

const StyledImage = styled(FastImage)({
  width: '100%',
  height: '100%',
})

const SubContainer = styled.View({
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const LabelContainer = styled.View({
  flexShrink: 1,
})

const StyledRightFilled = styled(RightFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))({
  flexShrink: 0,
})
