import React from 'react'

import { ReactionTypeEnum } from 'api/gen'
import { render, screen } from 'tests/utils'

import { OfferReactionHeaderButton } from './OfferReactionHeaderButton'

jest.mock('ui/svg/icons/ThumbUp', () => ({
  ThumbUp: () => {
    const { View } = jest.requireActual('react-native')
    return <View testID="ThumbUp" />
  },
}))

jest.mock('ui/svg/icons/ThumbUpFilled', () => ({
  ThumbUpFilled: () => {
    const { View } = jest.requireActual('react-native')
    return <View testID="ThumbUpFilled" />
  },
}))

describe('<OfferReactionHeaderButton />', () => {
  it('should render correctly by default', async () => {
    render(<OfferReactionHeaderButton onPress={jest.fn()} />)

    expect(await screen.findByLabelText('Réagir à cette offre')).toBeOnTheScreen()
  })

  it.each([
    {
      reactionType: ReactionTypeEnum.LIKE,
      testID: 'ThumbUpFilled',
    },
    {
      reactionType: ReactionTypeEnum.DISLIKE,
      testID: 'ThumbUpFilled',
    },
    {
      reactionType: ReactionTypeEnum.NO_REACTION,
      testID: 'ThumbUp',
    },
  ])('should render correctly for $reactionType reaction', async ({ reactionType, testID }) => {
    render(<OfferReactionHeaderButton onPress={jest.fn()} defaultReaction={reactionType} />)

    expect(await screen.findByTestId(testID)).toBeOnTheScreen()
  })
})
