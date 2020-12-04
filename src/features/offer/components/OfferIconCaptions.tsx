import React from 'react'
import styled from 'styled-components/native'

import { AlgoliaHit } from 'libs/algolia'
import { ColorsEnum, Spacer } from 'ui/theme'

import { OfferCategory } from '../atoms/OfferCategory'

export const OfferIconCaptions = ({ algoliaHit }: { algoliaHit: AlgoliaHit | undefined }) => {
  if (!algoliaHit) return <React.Fragment />

  return (
    <Row>
      <Spacer.Row numberOfSpaces={6} />
      <OfferCategory
        category={algoliaHit?.offer.category || null}
        label={algoliaHit?.offer.label}
      />
      <Separator />
      {/* Temporary to test Separators */}
      <OfferCategory
        category={algoliaHit?.offer.category || null}
        label={algoliaHit?.offer.label}
      />
      <Separator />
      <OfferCategory
        category={algoliaHit?.offer.category || null}
        label={algoliaHit?.offer.label}
      />
      <Spacer.Row numberOfSpaces={6} />
    </Row>
  )
}

const Row = styled.View({ flexDirection: 'row' })

const Separator = styled.View({ width: 1, backgroundColor: ColorsEnum.GREY_MEDIUM })
