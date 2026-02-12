import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { OfferArtist } from 'api/gen'
import { getArtistsButtonLabel, getArtistsLines } from 'features/offer/helpers/offerArtists'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { RightFilled } from 'ui/svg/icons/RightFilled'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  artists: OfferArtist[]
  isMultiArtistsEnabled?: boolean
  onPressArtistLink?: (artists: OfferArtist[]) => void
}

export const OfferArtists: FunctionComponent<Props> = ({
  artists,
  isMultiArtistsEnabled,
  onPressArtistLink,
}) => {
  const artistLinkEnabled = !!onPressArtistLink
  const artistsLines = artists.length === 1 ? [{ prefix: 'de', artists }] : getArtistsLines(artists)

  return (
    <ViewGap gap={2}>
      {artistsLines.map((line) => {
        const artistsNames = line.artists.map((artist) => artist.name)
        const artistsLabel = isMultiArtistsEnabled
          ? getArtistsButtonLabel(artistsNames)
          : artistsNames.join(', ')

        const artistsText = (
          <Container gap={2}>
            <Prefix>{line.prefix}</Prefix>
            <ArtistText
              allowFontScaling={false}
              numberOfLines={2}
              {...getHeadingAttrs(1)}
              {...accessibilityAndTestId(`Nom de l’artiste\u00a0: ${artistsLabel}`)}>
              {artistsLabel}
            </ArtistText>
            {artistLinkEnabled ? <StyledRightFilled testID="right-icon" /> : null}
          </Container>
        )

        if (artistLinkEnabled) {
          return (
            <InternalTouchableLink
              key={line.artists[0]?.id}
              navigateTo={{ screen: 'Artist' }}
              enableNavigate={false}
              onBeforeNavigate={() => onPressArtistLink(line.artists)}
              accessibilityLabel={
                artistsNames.length === 1
                  ? `Accéder à la page de ${artistsLabel}`
                  : 'Ouvrir la liste des artistes'
              }>
              {artistsText}
            </InternalTouchableLink>
          )
        }

        return artistsText
      })}
    </ViewGap>
  )
}

const Container = styled(ViewGap)({
  flexDirection: 'row',
})

const ArtistText = styled(Typo.Button)({
  flexShrink: 1,
  alignItems: 'center',
})

const Prefix = styled(Typo.Button)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const StyledRightFilled = styled(RightFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.designSystem.color.icon.default,
}))({
  flexShrink: 0,
  alignSelf: 'center',
})
