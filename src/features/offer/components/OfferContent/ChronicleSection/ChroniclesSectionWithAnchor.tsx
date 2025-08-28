import React, { FunctionComponent, useCallback, useRef } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { OfferResponseV2 } from 'api/gen'
import { ChronicleCardData } from 'features/chronicle/type'
import { ChronicleSection } from 'features/offer/components/OfferContent/ChronicleSection/ChronicleSection'
import { ChronicleVariantInfo } from 'features/offer/components/OfferContent/ChronicleSection/types'
import { useRegisterAnchor } from 'ui/components/anchor/AnchorContext'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'

type ChroniclesSectionWithAnchorProps = {
  chronicles?: ChronicleCardData[]
  chronicleVariantInfo: ChronicleVariantInfo
  offer: OfferResponseV2
  onSeeMoreButtonPress: (chronicleId: number) => void
  onShowChroniclesWritersModal: () => void
}

export const ChroniclesSectionWithAnchor: FunctionComponent<ChroniclesSectionWithAnchorProps> = ({
  chronicles,
  chronicleVariantInfo,
  offer,
  onSeeMoreButtonPress,
  onShowChroniclesWritersModal,
}) => {
  const chroniclesSectionRef = useRef<View>(null)
  const registerAnchor = useRegisterAnchor()

  const handleLayout = useCallback(() => {
    if (chroniclesSectionRef.current) {
      registerAnchor('chronicles-section', chroniclesSectionRef)
    }
  }, [registerAnchor])

  if (!chronicles?.length) return null

  return (
    <StyledSectionWithDivider visible testID="chronicles-section" gap={8}>
      <View ref={chroniclesSectionRef} onLayout={handleLayout} testID="chronicles-section-anchor">
        <ChronicleSection
          ctaLabel="Voir tous les avis"
          variantInfo={chronicleVariantInfo}
          data={chronicles}
          // It's dirty but necessary to use from parameter for the logs
          navigateTo={{
            screen: 'Chronicles',
            params: { offerId: offer.id, from: 'chronicles' },
          }}
          onSeeMoreButtonPress={onSeeMoreButtonPress}
          onShowChroniclesWritersModal={onShowChroniclesWritersModal}
        />
      </View>
    </StyledSectionWithDivider>
  )
}

const StyledSectionWithDivider = styled(SectionWithDivider)(({ theme }) => ({
  paddingBottom: theme.designSystem.size.spacing.xxl,
}))
