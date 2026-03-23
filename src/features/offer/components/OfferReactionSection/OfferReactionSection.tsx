import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AdviceCardData, AdviceVariantInfo } from 'features/advices/types'
import { InfoCounter } from 'features/offer/components/InfoCounter/InfoCounter'
import { formatLikesCounter } from 'features/offer/helpers/formatLikesCounter/formatLikesCounter'
import { getRecommendationText } from 'features/offer/helpers/getRecommendationText/getRecommendationText'
import { AnchorNames } from 'ui/components/anchor/anchor-name'
import { useScrollToAnchor } from 'ui/components/anchor/AnchorContext'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { ThumbUpFilled } from 'ui/svg/icons/ThumbUpFilled'
import { Star } from 'ui/svg/Star'

type Props = {
  likesCount?: number
  advicesCount?: number | null
  headlineOffersCount?: number
  adviceVariantInfo: AdviceVariantInfo
  advices?: AdviceCardData[]
}

export const OfferReactionSection: FunctionComponent<Props> = ({
  likesCount,
  advicesCount,
  headlineOffersCount,
  adviceVariantInfo,
  advices,
}) => {
  const scrollToAnchor = useScrollToAnchor()
  const hasPublishedAdvices = (advices?.length ?? 0) > 0
  const hasUnpublishedAdvices = (advicesCount ?? 0) - (advices?.length ?? 0) > 0
  const advicesCounter = advicesCount ?? 0

  const likesCounterElement = likesCount ? (
    <LikesInfoCounter text={formatLikesCounter(likesCount)} />
  ) : null

  const handleAdvicesPress = () => {
    scrollToAnchor(AnchorNames.CLUB_ADVICE_SECTION)
  }

  const getAdvicesCounterElement = (): React.ReactNode => {
    if (hasPublishedAdvices) {
      return (
        <TouchableOpacity onPress={handleAdvicesPress} testID="advicesCounter">
          <AdvicesInfoCounter
            text={`${advicesCounter} avis ${adviceVariantInfo.labelReaction}`}
            icon={adviceVariantInfo.SmallIcon}
          />
        </TouchableOpacity>
      )
    }
    if (hasUnpublishedAdvices) {
      return (
        <AdvicesInfoCounter
          text={`Recommandé par le ${adviceVariantInfo.labelReaction}`}
          icon={adviceVariantInfo.SmallIcon}
        />
      )
    }

    return null
  }

  const advicesCounterElement = getAdvicesCounterElement()

  const headlineOffersCounterElement = headlineOffersCount ? (
    <HeadlineOffersCount text={getRecommendationText(headlineOffersCount)} />
  ) : null

  if (!(likesCounterElement || advicesCounterElement || headlineOffersCounterElement)) return null

  return (
    <ViewGap gap={4}>
      {likesCounterElement || advicesCounterElement ? (
        <InfosCounterContainer gap={2}>
          {likesCounterElement}
          {advicesCounterElement}
        </InfosCounterContainer>
      ) : null}
      {headlineOffersCounterElement}
    </ViewGap>
  )
}

const InfosCounterContainer = styled(ViewGap)({
  flexDirection: 'row',
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

const AdvicesInfoCounter = styled(InfoCounter).attrs<{ icon: React.ReactNode }>(({ icon }) => ({
  icon,
}))``

const HeadlineOffersCount = styled(InfoCounter).attrs<{ icon?: React.ReactNode }>({
  icon: <StarIcon testID="headlineOffersCounterIcon" />,
})``
