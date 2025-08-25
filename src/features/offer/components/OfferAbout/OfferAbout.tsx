import React, { FunctionComponent, useRef, useState } from 'react'
import { ScrollView, View } from 'react-native'
import styled from 'styled-components/native'

import { OfferResponseV2 } from 'api/gen'
import { OfferAccessibility } from 'features/offer/components/OfferAccessibility/OfferAccessibility'
import { OfferMetadataItemProps } from 'features/offer/components/OfferMetadataItem/OfferMetadataItem'
import { OfferMetadataList } from 'features/offer/components/OfferMetadataList/OfferMetadataList'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Markdown } from 'ui/components/Markdown/Markdown'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { ArrowDown } from 'ui/svg/icons/ArrowDown'
import { ArrowUp } from 'ui/svg/icons/ArrowUp'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  offer: OfferResponseV2
  metadata: OfferMetadataItemProps[]
  hasMetadata: boolean
  shouldDisplayAccessibilitySection: boolean
}

const NUMBER_OF_LINES_OF_DESCRIPTION_SECTION = 5

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  return layoutMeasurement.height + contentOffset.y >= contentSize.height
}

const isCloseToTop = ({ contentOffset }) => {
  return contentOffset.y < 1
}

export const OfferAbout: FunctionComponent<Props> = ({
  offer,
  metadata,
  hasMetadata,
  shouldDisplayAccessibilitySection,
}) => {
  const scrollViewRef = useRef<ScrollView>(null)
  const [scrollOffset, setScrollOffset] = useState(0)
  const [seeButtonMode, setSeeButtonMode] = useState('down')
  return (
    <ViewGap gap={2}>
      <Typo.Title3 {...getHeadingAttrs(2)}>À propos</Typo.Title3>
      <ViewGap gap={2}>
        {hasMetadata ? <OfferMetadataList metadata={metadata} /> : null}

        <ViewGap gap={8}>
          {offer.description ? (
            <View>
              <Typo.BodyAccent>Description&nbsp;:</Typo.BodyAccent>
              {/* <CollapsibleText numberOfLines={NUMBER_OF_LINES_OF_DESCRIPTION_SECTION}>
                <Markdown>{offer.description}</Markdown>
              </CollapsibleText> */}
              <ScrollView
                style={{ height: '120px', overflow: 'scroll' }}
                showsHorizontalScrollIndicator={false}
                ref={scrollViewRef}
                onScroll={({ nativeEvent }) => {
                  if (isCloseToBottom(nativeEvent)) setSeeButtonMode('up')
                  if (isCloseToTop(nativeEvent)) setSeeButtonMode('down')
                  const { contentOffset, contentSize, layoutMeasurement } = nativeEvent
                  setScrollOffset(
                    contentOffset.y < contentSize.height - layoutMeasurement.height
                      ? contentOffset.y
                      : contentSize.height - layoutMeasurement.height
                  )
                }}
                scrollEventThrottle={400}
                fadingEdgeLength={100}>
                <Markdown>{offer.description}</Markdown>
              </ScrollView>
              <ButtonContainer>
                <SeeMoreButton
                  wording={seeButtonMode === 'down' ? 'Voir plus' : 'Haut'}
                  onPress={() => {
                    scrollViewRef.current?.scrollTo({
                      x: 0,
                      y: seeButtonMode === 'down' ? scrollOffset + 40 : scrollOffset - 40,
                    })
                  }}
                  accessibilityLabel="Faire défiler le texte"
                  icon={seeButtonMode === 'down' ? ArrowDown : ArrowUp}
                  buttonHeight="extraSmall"
                />
              </ButtonContainer>
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

const ButtonContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'flex-end',
})

const SeeMoreButton = styledButton(ButtonTertiaryBlack)({
  maxWidth: 120,
})
