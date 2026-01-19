import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { getArtistsButtonLabel } from 'features/offer/core/offerArtists'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { RightFilled } from 'ui/svg/icons/RightFilled'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  artistsNames: string[]
  isMultiArtistsEnabled?: boolean
  onPressArtistLink?: () => void
}

export const OfferArtists: FunctionComponent<Props> = ({
  artistsNames,
  isMultiArtistsEnabled,
  onPressArtistLink,
}) => {
  const artistLinkEnabled = !!onPressArtistLink
  const prefix = 'de'

  const artists = isMultiArtistsEnabled
    ? getArtistsButtonLabel(artistsNames)
    : artistsNames.join(', ')

  const artistsText = (
    <Container gap={2}>
      <Prefix>{prefix}</Prefix>
      <ArtistText
        allowFontScaling={false}
        numberOfLines={2}
        {...getHeadingAttrs(1)}
        {...accessibilityAndTestId(`Nom de l’artiste\u00a0: ${artists}`)}>
        {artists}
      </ArtistText>
      {artistLinkEnabled ? <StyledRightFilled testID="right-icon" /> : null}
    </Container>
  )

  return (
    <React.Fragment>
      {artistLinkEnabled ? (
        <InternalTouchableLink
          navigateTo={{ screen: 'Artist' }}
          enableNavigate={false}
          onBeforeNavigate={onPressArtistLink}
          accessibilityLabel={
            artistsNames.length === 1
              ? `Accéder à la page de ${artists}`
              : 'Ouvrir la liste des artistes'
          }>
          {artistsText}
        </InternalTouchableLink>
      ) : (
        artistsText
      )}
    </React.Fragment>
  )
}

const Container = styled(ViewGap)({
  flexDirection: 'row',
})

const ArtistText = styled(Typo.BodyAccent)({
  flexShrink: 1,
  alignItems: 'center',
})

const Prefix = styled(Typo.BodyAccent)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const StyledRightFilled = styled(RightFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.designSystem.color.icon.default,
}))({
  flexShrink: 0,
  alignSelf: 'center',
})
