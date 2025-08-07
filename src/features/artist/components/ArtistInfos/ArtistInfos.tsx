import React from 'react'
import styled from 'styled-components/native'

import { capitalize } from 'libs/formatter/capitalize'
import { ensureEndingDot } from 'libs/parsers/ensureEndingDot'
import { highlightLinks } from 'libs/parsers/highlightLinks'
import { CollapsibleText } from 'ui/components/CollapsibleText/CollapsibleText'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'

import { ArtistTopInfos } from './ArtistTopInfos/ArtistTopInfos'

type ArtistInfosProps = {
  name: string
  description?: string
  imageURL?: string
}

const NUMBER_OF_LINES_OF_DESCRIPTION_SECTION = 5

export const ArtistInfos = ({ name, description = '', imageURL }: ArtistInfosProps) => {
  const descriptionWithDot = ensureEndingDot(description)
  const capitalizedDescriptionWithDot = capitalize(descriptionWithDot)

  return (
    <ViewGap gap={6}>
      <ArtistTopInfos name={name} avatarImage={imageURL} />
      {capitalizedDescriptionWithDot ? (
        <Description gap={1}>
          <Typo.BodyAccent>Quelques infos à son sujet</Typo.BodyAccent>
          <CollapsibleText numberOfLines={NUMBER_OF_LINES_OF_DESCRIPTION_SECTION}>
            {highlightLinks(capitalizedDescriptionWithDot)}
          </CollapsibleText>
        </Description>
      ) : null}
    </ViewGap>
  )
}

const Description = styled(ViewGap)(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))
