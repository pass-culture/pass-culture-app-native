import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import { styled } from 'styled-components/native'

import { OfferArtist } from 'features/offer/types'
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
  artist: OfferArtist
  navigateTo?: InternalNavigationProps['navigateTo']
  onBeforeNavigate?: () => void
}

const hasArtistPage = (artist: OfferArtist): boolean => Boolean(artist.id)

export const OfferArtistItem: FunctionComponent<Props> = ({
  artist,
  navigateTo,
  onBeforeNavigate,
}) => {
  const artistHasPage = hasArtistPage(artist)

  const accessibilityLabel = artistHasPage
    ? `${artist.name}, accéder à la page`
    : `${artist.name}, page non disponible`

  const content = (
    <Container gap={2}>
      <Avatar>
        {artistHasPage && artist.image ? (
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
          {artistHasPage ? (
            <Typo.Button>{artist.name}</Typo.Button>
          ) : (
            <Typo.Body>{artist.name}</Typo.Body>
          )}
        </LabelContainer>
        {artistHasPage ? <StyledRightFilled testID="chevronIcon" /> : null}
      </SubContainer>
    </Container>
  )

  if (artistHasPage && navigateTo) {
    return (
      <InternalTouchableLink
        navigateTo={navigateTo}
        onBeforeNavigate={onBeforeNavigate}
        accessibilityLabel={accessibilityLabel}>
        {content}
      </InternalTouchableLink>
    )
  }

  return (
    <View accessible accessibilityLabel={accessibilityLabel}>
      {content}
    </View>
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
