import React, { FunctionComponent } from 'react'
import { View } from 'react-native'

import { OfferResponse } from 'api/gen'
import { OfferAccessibility } from 'features/offerv2/components/OfferAccessibility/OfferAccessibility'
import { OfferMetadataList } from 'features/offerv2/components/OfferMetadataList/OfferMetadataList'
import { getOfferMetadata } from 'features/offerv2/helpers/getOfferMetadata/getOfferMetadata'
import { isNullOrUndefined } from 'shared/isNullOrUndefined/isNullOrUndefined'
import { CollapsibleText } from 'ui/components/CollapsibleText/CollapsibleText'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  offer: OfferResponse
}

const NUMBER_OF_LINES_OF_DESCRIPTION_SECTION = 5

export const OfferAbout: FunctionComponent<Props> = ({ offer }) => {
  const extraData = offer.extraData ?? undefined
  const metadata = getOfferMetadata(extraData)
  const hasMetadata = metadata.length > 0
  const shouldDisplayAccessibilitySection = !(
    isNullOrUndefined(offer.accessibility.visualDisability) &&
    isNullOrUndefined(offer.accessibility.audioDisability) &&
    isNullOrUndefined(offer.accessibility.mentalDisability) &&
    isNullOrUndefined(offer.accessibility.motorDisability)
  )

  const shouldDisplayAboutSection =
    shouldDisplayAccessibilitySection || !!offer.description || hasMetadata

  return shouldDisplayAboutSection ? (
    <View>
      <Spacer.Column numberOfSpaces={2} />
      <Typo.Title3 {...getHeadingAttrs(2)}>À propos</Typo.Title3>
      <Spacer.Column numberOfSpaces={4} />

      {hasMetadata ? (
        <React.Fragment>
          <OfferMetadataList metadata={metadata} />
          <Spacer.Column numberOfSpaces={2} />
        </React.Fragment>
      ) : null}

      {offer.description ? (
        <React.Fragment>
          <Typo.ButtonText>Description&nbsp;:</Typo.ButtonText>
          <CollapsibleText numberOfLines={NUMBER_OF_LINES_OF_DESCRIPTION_SECTION}>
            {offer.description}
          </CollapsibleText>
        </React.Fragment>
      ) : null}
      <Spacer.Column numberOfSpaces={8} />
      {shouldDisplayAccessibilitySection ? (
        <React.Fragment>
          <OfferAccessibility accessibility={offer.accessibility} />
          <Spacer.Column numberOfSpaces={8} />
        </React.Fragment>
      ) : null}
    </View>
  ) : null
}
