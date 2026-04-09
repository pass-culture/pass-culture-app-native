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
import { Tag } from 'ui/designSystem/Tag/Tag'
import { TagVariant } from 'ui/designSystem/Tag/types'
import { ThumbUpFilled } from 'ui/svg/icons/ThumbUpFilled'
import { ProEditoCertification } from 'ui/svg/ProEditoCertification'
import { Star } from 'ui/svg/Star'

type Props = {
  likesCount?: number
  clubAdvicesCount?: number | null
  headlineOffersCount?: number
  adviceVariantInfo: AdviceVariantInfo
  clubAdvices?: AdviceCardData[]
  proAdvicesCount?: number
  proAdvices?: AdviceCardData[]
  enableProReviewNewTag?: boolean
}

export const OfferReactionSection: FunctionComponent<Props> = ({
  likesCount,
  clubAdvicesCount,
  headlineOffersCount,
  adviceVariantInfo,
  clubAdvices,
  proAdvicesCount,
  proAdvices,
  enableProReviewNewTag,
}) => {
  const scrollToAnchor = useScrollToAnchor()

  const clubAdvicesStatus: AdvicesStatus = getAdvicesStatus(clubAdvicesCount, clubAdvices?.length)
  const proAdvicesStatus: AdvicesStatus = getAdvicesStatus(proAdvicesCount, proAdvices?.length)

  const likesCounterElement = likesCount ? (
    <LikesInfoCounter text={formatLikesCounter(likesCount)} />
  ) : null

  const clubAdvicesCounterElement = (
    <OfferAdvicesCounter
      testID="clubAdvicesCounter"
      publishedText={`${clubAdvicesStatus.total} avis ${adviceVariantInfo.labelReaction}`}
      unpublishedText={`Recommandé par le ${adviceVariantInfo.labelReaction}`}
      icon={adviceVariantInfo.SmallIcon}
      advicesStatus={clubAdvicesStatus}
      onPress={() => scrollToAnchor(AnchorNames.CLUB_ADVICE_SECTION)}
    />
  )

  const proAdvicesCounterElement = (
    <ProAdvicesCounterContainer gap={2}>
      <OfferAdvicesCounter
        testID="proAdvicesCounter"
        publishedText={`${proAdvicesStatus.total} avis des pros`}
        unpublishedText="Recommandé par les pros"
        icon={<SmallProEditoIcon />}
        advicesStatus={proAdvicesStatus}
        onPress={() => scrollToAnchor(AnchorNames.PRO_ADVICE_SECTION)}
      />
      {enableProReviewNewTag ? (
        <TagContainer>
          <Tag variant={TagVariant.NEW} label="Nouveau" />
        </TagContainer>
      ) : null}
    </ProAdvicesCounterContainer>
  )

  const headlineOffersCounterElement = headlineOffersCount ? (
    <HeadlineOffersCount text={getRecommendationText(headlineOffersCount)} />
  ) : null

  if (
    !(
      likesCounterElement ||
      clubAdvicesCounterElement ||
      headlineOffersCounterElement ||
      proAdvicesCounterElement
    )
  )
    return null

  return (
    <ViewGap gap={4}>
      {likesCounterElement || clubAdvicesCounterElement || proAdvicesCounterElement ? (
        <InfosCounterContainer gap={2}>
          {likesCounterElement}
          {clubAdvicesCounterElement}
          {proAdvicesCounterElement}
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
  size: theme.icons.sizes.small,
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

const SmallProEditoIcon = styled(ProEditoCertification).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.proEdito,
  size: theme.icons.sizes.small,
}))``

const TagContainer = styled.View({
  alignItems: 'center',
})

const ProAdvicesCounterContainer = styled(ViewGap)({
  flexDirection: 'row',
  alignItems: 'center',
})
