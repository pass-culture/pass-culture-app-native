import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AdviceCardData, AdviceVariantInfo } from 'features/advices/types'
import { InfoCounter } from 'features/offer/components/InfoCounter/InfoCounter'
import { OfferAdvicesCounter } from 'features/offer/components/OfferAdvicesCounter/OfferAdvicesCounter'
import { formatLikesCounter } from 'features/offer/helpers/formatLikesCounter/formatLikesCounter'
import { getRecommendationText } from 'features/offer/helpers/getRecommendationText/getRecommendationText'
import { getAdvicesStatus } from 'features/offer/helpers/offerAdvices'
import { AdvicesStatus } from 'features/offer/types'
import { AnchorNames } from 'ui/components/anchor/anchor-name'
import { useScrollToAnchor } from 'ui/components/anchor/AnchorContext'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { ThumbUpFilled } from 'ui/svg/icons/ThumbUpFilled'
import { Star } from 'ui/svg/Star'

type Props = {
  likesCount?: number
  clubAdvicesCount?: number | null
  headlineOffersCount?: number
  adviceVariantInfo?: AdviceVariantInfo
  clubAdvices?: AdviceCardData[]
}

export const OfferReactionSection: FunctionComponent<Props> = ({
  likesCount,
  clubAdvicesCount,
  headlineOffersCount,
  adviceVariantInfo,
  clubAdvices,
}) => {
  const scrollToAnchor = useScrollToAnchor()

  const clubAdvicesStatus: AdvicesStatus = getAdvicesStatus(clubAdvicesCount, clubAdvices?.length)
  const hasClubAdvices =
    !!adviceVariantInfo && (clubAdvicesStatus.hasPublished || clubAdvicesStatus.hasUnpublished)
  const hasLikes = !!likesCount
  const hasHeadlineOffers = !!headlineOffersCount

  const likesCounterElement = hasLikes ? (
    <LikesInfoCounter text={formatLikesCounter(likesCount)} />
  ) : null

  const clubAdvicesCounterElement =
    hasClubAdvices && adviceVariantInfo ? (
      <OfferAdvicesCounter
        testID="clubAdvicesCounter"
        publishedText={`${clubAdvicesStatus.total} avis ${adviceVariantInfo.labelReaction}`}
        unpublishedText={`Recommandé par le ${adviceVariantInfo.labelReaction}`}
        icon={adviceVariantInfo.SmallIcon}
        advicesStatus={clubAdvicesStatus}
        onPress={() => scrollToAnchor(AnchorNames.CLUB_ADVICE_SECTION)}
      />
    ) : null

  const headlineOffersCounterElement = hasHeadlineOffers ? (
    <HeadlineOffersCount text={getRecommendationText(headlineOffersCount)} />
  ) : null

  if (!(hasLikes || hasClubAdvices || hasHeadlineOffers)) return null

  return (
    <ViewGap gap={4}>
      {hasLikes || hasClubAdvices ? (
        <InfosCounterContainer gap={2}>
          {likesCounterElement}
          {clubAdvicesCounterElement}
        </InfosCounterContainer>
      ) : null}
      {headlineOffersCounterElement}
    </ViewGap>
  )
}

const InfosCounterContainer = styled(ViewGap)({
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
})

const ThumbUpIcon = styled(ThumbUpFilled).attrs(({ theme }) => ({
  size: theme.designSystem.size.icon.m,
  color: theme.designSystem.color.icon.brandPrimary,
}))``

const StarIcon = styled(Star).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.headline,
}))``

const LikesInfoCounter = styled(InfoCounter).attrs<{ icon?: React.ReactNode }>({
  icon: <ThumbUpIcon testID="likesCounterIcon" />,
})``

const HeadlineOffersCount = styled(InfoCounter).attrs<{ icon?: React.ReactNode }>({
  icon: <StarIcon testID="headlineOffersCounterIcon" />,
})``
