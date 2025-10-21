import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { ChronicleCardData } from 'features/chronicle/type'
import { InfoCounter } from 'features/offer/components/InfoCounter/InfoCounter'
import { ChronicleVariantInfo } from 'features/offer/components/OfferContent/ChronicleSection/types'
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
  chroniclesCount?: number | null
  headlineOffersCount?: number
  chronicleVariantInfo: ChronicleVariantInfo
  chronicles?: ChronicleCardData[]
}

export const OfferReactionSection: FunctionComponent<Props> = ({
  likesCount,
  chroniclesCount,
  headlineOffersCount,
  chronicleVariantInfo,
  chronicles,
}) => {
  const scrollToAnchor = useScrollToAnchor()
  const hasPublishedChronicles = (chronicles?.length ?? 0) > 0
  const hasUnpublishedChronicles = (chroniclesCount ?? 0) - (chronicles?.length ?? 0) > 0

  const likesCounterElement = likesCount ? (
    <LikesInfoCounter text={formatLikesCounter(likesCount)} />
  ) : null

  const handleChroniclesPress = () => {
    scrollToAnchor(AnchorNames.CHRONICLES_SECTION)
  }

  const getChroniclesCounterElement = (): React.ReactNode => {
    if (hasPublishedChronicles) {
      return (
        <TouchableOpacity onPress={handleChroniclesPress} testID="chroniclesCounter">
          <ChroniclesInfoCounter
            text={`${chronicles?.length ?? 0} avis`}
            icon={chronicleVariantInfo.SmallIcon}
          />
        </TouchableOpacity>
      )
    }
    if (hasUnpublishedChronicles) {
      return (
        <ChroniclesInfoCounter
          text={`Recommandé par le ${chronicleVariantInfo.labelReaction}`}
          icon={chronicleVariantInfo.SmallIcon}
        />
      )
    }

    return null
  }

  const chroniclesCounterElement = getChroniclesCounterElement()

  const headlineOffersCounterElement = headlineOffersCount ? (
    <HeadlineOffersCount text={getRecommendationText(headlineOffersCount)} />
  ) : null

  if (!(likesCounterElement || chroniclesCounterElement || headlineOffersCounterElement))
    return null

  return (
    <ViewGap gap={4}>
      {likesCounterElement || chroniclesCounterElement ? (
        <InfosCounterContainer gap={2}>
          {likesCounterElement}
          {chroniclesCounterElement}
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

const ChroniclesInfoCounter = styled(InfoCounter).attrs<{ icon: React.ReactNode }>(({ icon }) => ({
  icon,
}))``

const HeadlineOffersCount = styled(InfoCounter).attrs<{ icon?: React.ReactNode }>({
  icon: <StarIcon testID="headlineOffersCounterIcon" />,
})``
