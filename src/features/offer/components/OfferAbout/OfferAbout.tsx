import React, { FunctionComponent } from 'react'
import { View } from 'react-native'

import { OfferResponseV2 } from 'api/gen'
import { OfferAccessibility } from 'features/offer/components/OfferAccessibility/OfferAccessibility'
import { OfferMetadataItemProps } from 'features/offer/components/OfferMetadataItem/OfferMetadataItem'
import { OfferMetadataList } from 'features/offer/components/OfferMetadataList/OfferMetadataList'
import { CollapsibleText } from 'ui/components/CollapsibleText/CollapsibleText'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { TypoDS } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  offer: OfferResponseV2
  metadata: OfferMetadataItemProps[]
  hasMetadata: boolean
  shouldDisplayAccessibilitySection: boolean
}

const NUMBER_OF_LINES_OF_DESCRIPTION_SECTION = 5

export const OfferAbout: FunctionComponent<Props> = ({
  offer,
  metadata,
  hasMetadata,
  shouldDisplayAccessibilitySection,
}) => {
  return (
    <ViewGap gap={2}>
      <TypoDS.Title3 {...getHeadingAttrs(2)}>À propos</TypoDS.Title3>
      <ViewGap gap={2}>
        {hasMetadata ? <OfferMetadataList metadata={metadata} /> : null}

        <ViewGap gap={8}>
          {offer.description ? (
            <View>
              <TypoDS.BodyAccent>Description&nbsp;:</TypoDS.BodyAccent>
              <CollapsibleText numberOfLines={NUMBER_OF_LINES_OF_DESCRIPTION_SECTION}>
                {offer.description}
              </CollapsibleText>
            </View>
          ) : null}
          {shouldDisplayAccessibilitySection ? (
            <OfferAccessibility accessibility={offer.accessibility} />
          ) : null}
        </ViewGap>
      </ViewGap>
    </ViewGap>
  )
}
