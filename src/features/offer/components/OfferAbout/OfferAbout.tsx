import MarkdownIt from 'markdown-it'
import React, { FunctionComponent } from 'react'
import { useWindowDimensions, View } from 'react-native'
import RenderHTML from 'react-native-render-html'

import { OfferResponseV2 } from 'api/gen'
import { OfferAccessibility } from 'features/offer/components/OfferAccessibility/OfferAccessibility'
import { OfferMetadataItemProps } from 'features/offer/components/OfferMetadataItem/OfferMetadataItem'
import { OfferMetadataList } from 'features/offer/components/OfferMetadataList/OfferMetadataList'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  offer: OfferResponseV2
  metadata: OfferMetadataItemProps[]
  hasMetadata: boolean
  shouldDisplayAccessibilitySection: boolean
}

const md = new MarkdownIt({ html: true })

export const OfferAbout: FunctionComponent<Props> = ({
  offer,
  metadata,
  hasMetadata,
  shouldDisplayAccessibilitySection,
}) => {
  // eslint-disable-next-line local-rules/apostrophe-in-text
  const description = `
  ### Description test
  
  **Lorem ipsum** dolor sit amet, <i>consectetur</i> adipiscing elit. <s>Sed do eiusmod</s> tempor incididunt ut labore et dolore magna aliqua.

  <h1>This HTML snippet is now <s>rendered with native</s> components\u00a0!</h1>
  
  #### Sous-titre 1

  1. Ut enim ad minim veniam
  2. **Quis nostrud exercitation ullamco
  3. *Laboris nisi ut aliquip*
  
  ##### Sous-titre 2
  
  - <i>Duis aute irure dolor in reprehenderit</i>
  - In *voluptate velit esse* cillum dolore
  - **Eu fugiat** nulla pariatur

  Pour plus d'informations, visitez [notre site web](https://example.com).
  
  > _Excepteur sint occaecat_ cupidatat non proident
    
  ### Image Example\u00a0![Alt text](https://example.com/image.jpg)
  `

  const htmlContent = md.render(description)
  const { width } = useWindowDimensions()

  return (
    <ViewGap gap={4}>
      <Typo.Title3 {...getHeadingAttrs(2)}>À propos</Typo.Title3>
      <ViewGap gap={2}>
        {hasMetadata ? <OfferMetadataList metadata={metadata} /> : null}

        <ViewGap gap={8}>
          {offer.description ? (
            <View>
              <Typo.ButtonText>Description&nbsp;:</Typo.ButtonText>
              <RenderHTML contentWidth={width} source={{ html: htmlContent }} />
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
