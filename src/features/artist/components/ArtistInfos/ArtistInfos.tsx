import React from 'react'
import styled from 'styled-components/native'

import { useArtistQuery } from 'features/artist/queries/useArtistQuery'
import { capitalizeFirstLetter } from 'libs/parsers/capitalizeFirstLetter'
import { ensureEndingDot } from 'libs/parsers/ensureEndingDot'
import { highlightLinks } from 'libs/parsers/highlightLinks'
import { CollapsibleText } from 'ui/components/CollapsibleText/CollapsibleText'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'

import { ArtistTopInfos } from './ArtistTopInfos/ArtistTopInfos'

type ArtistInfosProps = {
  artistId: string
}

const NUMBER_OF_LINES_OF_DESCRIPTION_SECTION = 5

export const ArtistInfos = ({ artistId }: ArtistInfosProps) => {
  const { data: artist } = useArtistQuery(artistId)
  const descriptionWithDot = ensureEndingDot(artist?.description ?? '')
  const capitalizedDescriptionWithDot = capitalizeFirstLetter(descriptionWithDot)

  return artist ? (
    <ViewGap gap={6}>
      <ArtistTopInfos name={artist?.name} avatarImage={artist?.image} />
      {capitalizedDescriptionWithDot ? (
        <Description gap={1}>
          <Typo.BodyAccent>Quelques infos à son sujet</Typo.BodyAccent>
          <CollapsibleText numberOfLines={NUMBER_OF_LINES_OF_DESCRIPTION_SECTION}>
            {highlightLinks(capitalizedDescriptionWithDot)}
          </CollapsibleText>
        </Description>
      ) : null}
    </ViewGap>
  ) : null
}

const Description = styled(ViewGap)(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))
