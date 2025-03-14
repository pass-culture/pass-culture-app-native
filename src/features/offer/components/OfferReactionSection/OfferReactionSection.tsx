import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { InfoCounter } from 'features/offer/components/InfoCounter/InfoCounter'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { BookClubCertification } from 'ui/svg/BookClubCertification'
import { ThumbUpFilled } from 'ui/svg/icons/ThumbUpFilled'

type Props = {
  likesCount?: number
  chroniclesCount?: number
}

export const OfferReactionSection: FunctionComponent<Props> = ({ likesCount, chroniclesCount }) => {
  const likesCounterElement = likesCount ? <LikesInfoCounter text={`${likesCount} j’aime`} /> : null
  const chroniclesCounterElement = chroniclesCount ? (
    <ChroniclesInfoCounter text={`${chroniclesCount} avis`} />
  ) : null

  if (!(likesCounterElement || chroniclesCounterElement)) return null

  return (
    <ViewGap gap={4}>
      <InfosCounterContainer gap={2}>
        {likesCounterElement}
        {chroniclesCounterElement}
      </InfosCounterContainer>
    </ViewGap>
  )
}

const InfosCounterContainer = styled(ViewGap)({
  flexDirection: 'row',
})

const ThumbUpIcon = styled(ThumbUpFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
  color: theme.colors.primary,
}))``

const BookClubIcon = styled(BookClubCertification).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``

const LikesInfoCounter = styled(InfoCounter).attrs(() => ({
  icon: <ThumbUpIcon testID="likesCounterIcon" />,
}))``

const ChroniclesInfoCounter = styled(InfoCounter).attrs(() => ({
  icon: <BookClubIcon testID="chroniclesCounterIcon" />,
}))``
