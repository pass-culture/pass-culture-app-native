import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { OfferResponseV2 } from 'api/gen'
import { InfoCounter } from 'features/offer/components/InfoCounter/InfoCounter'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { BookClubCertification } from 'ui/svg/BookClubCertification'
import { ThumbUpFilled } from 'ui/svg/icons/ThumbUpFilled'

type Props = {
  offer: OfferResponseV2
}

export const OfferReactions: FunctionComponent<Props> = ({ offer }) => {
  const { reactionsCount, chronicles } = offer
  const counters = [
    reactionsCount.likes > 0 && {
      icon: <ThumbUpIcon testID="thumbUp" />,
      text: `${reactionsCount.likes} j’aime`,
    },
    chronicles.length > 0 && {
      icon: <BookClubIcon testID="bookClubCertification" />,
      text: `${chronicles.length} avis`,
    },
  ].filter((counter): counter is { icon: JSX.Element; text: string } => !!counter)

  if (!counters.length) return null

  return (
    <Container gap={2}>
      {counters.map(({ icon, text }) => (
        <InfoCounter key={text} icon={icon} text={text} />
      ))}
    </Container>
  )
}

const Container = styled(ViewGap)({
  flexDirection: 'row',
})

const ThumbUpIcon = styled(ThumbUpFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
  color: theme.colors.primary,
}))``

const BookClubIcon = styled(BookClubCertification).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``
