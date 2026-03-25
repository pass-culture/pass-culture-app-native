import React, { FunctionComponent, useCallback, useRef } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { OfferResponse } from 'api/gen'
import { AdviceCardData, AdviceVariantInfo } from 'features/advices/types'
import { ClubAdviceSection } from 'features/offer/components/OfferContent/ClubAdviceSection/ClubAdviceSection'
import { AnchorNames } from 'ui/components/anchor/anchor-name'
import { useRegisterAnchor } from 'ui/components/anchor/AnchorContext'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'

type ClubAdviceSectionWithAnchorProps = {
  advices?: AdviceCardData[]
  adviceVariantInfo: AdviceVariantInfo
  offer: OfferResponse
  onSeeMoreButtonPress: (chronicleId: number) => void
  onShowClubAdviceWritersModal: () => void
  onSeeAllReviewsPress: () => void
}

export const ClubAdviceSectionWithAnchor: FunctionComponent<ClubAdviceSectionWithAnchorProps> = ({
  advices,
  adviceVariantInfo,
  offer,
  onSeeMoreButtonPress,
  onShowClubAdviceWritersModal,
  onSeeAllReviewsPress,
}) => {
  const clubAdviceSectionRef = useRef<View>(null)
  const registerAnchor = useRegisterAnchor()

  const handleLayout = useCallback(() => {
    if (clubAdviceSectionRef.current) {
      registerAnchor(AnchorNames.CLUB_ADVICE_SECTION, clubAdviceSectionRef)
    }
  }, [registerAnchor])

  if (!advices?.length || !offer.chroniclesCount) return null

  return (
    <StyledSectionWithDivider visible testID="club-advice-section" gap={8}>
      <View ref={clubAdviceSectionRef} onLayout={handleLayout} testID="club-advice-section-anchor">
        <ClubAdviceSection
          ctaLabel={`Lire les ${offer.chroniclesCount} avis`}
          variantInfo={adviceVariantInfo}
          data={advices}
          // It's dirty but necessary to use from parameter for the logs
          navigateTo={{
            screen: 'ClubAdvices',
            params: { offerId: offer.id, from: 'chronicles' },
          }}
          onBeforeNavigate={onSeeAllReviewsPress}
          onSeeMoreButtonPress={onSeeMoreButtonPress}
          onShowClubAdviceWritersModal={onShowClubAdviceWritersModal}
        />
      </View>
    </StyledSectionWithDivider>
  )
}

const StyledSectionWithDivider = styled(SectionWithDivider)(({ theme }) => ({
  paddingBottom: theme.designSystem.size.spacing.xxl,
}))
