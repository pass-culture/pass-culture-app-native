import React, { FunctionComponent } from 'react'
import { View } from 'react-native'

import { OfferResponseV2 } from 'api/gen'
import { OfferAccessibility } from 'features/offer/components/OfferAccessibility/OfferAccessibility'
import { OfferMetadataItemProps } from 'features/offer/components/OfferMetadataItem/OfferMetadataItem'
import { OfferMetadataList } from 'features/offer/components/OfferMetadataList/OfferMetadataList'
import { CollapsibleText } from 'ui/components/CollapsibleText/CollapsibleText'
import { Markdown } from 'ui/components/Markdown/Markdown'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'
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
      <Typo.Title3 {...getHeadingAttrs(2)}>À propos</Typo.Title3>
      <ViewGap gap={2}>
        {hasMetadata ? <OfferMetadataList metadata={metadata} /> : null}

        <ViewGap gap={8}>
          {offer.description ? (
            <View>
              <Typo.BodyAccent>Description&nbsp;:</Typo.BodyAccent>

              <CollapsibleText collapsedLineCount={NUMBER_OF_LINES_OF_DESCRIPTION_SECTION}>
                <Markdown>{offer.description}</Markdown>
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
