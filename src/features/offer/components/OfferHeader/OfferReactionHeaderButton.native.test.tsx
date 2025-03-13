import React from 'react'
import { Animated } from 'react-native'

import { ReactionTypeEnum } from 'api/gen'
import { render, screen } from 'tests/utils'

import { OfferReactionHeaderButton } from './OfferReactionHeaderButton'

const ANIMATION_STATE_PROP = {
  iconBackgroundColor: {} as Animated.AnimatedInterpolation<string>,
  iconBorderColor: {} as Animated.AnimatedInterpolation<string>,
  transition: {
    interpolate: jest.fn(),
  } as unknown as Animated.AnimatedInterpolation<number>,
}

describe('<OfferReactionHeaderButton />', () => {
  it('should render correctly by default', async () => {
    render(<OfferReactionHeaderButton onPress={jest.fn()} animationState={ANIMATION_STATE_PROP} />)

    expect(await screen.findByTestId('animated-icon-like')).toBeOnTheScreen()
  })

  it.each([
    { reactionType: ReactionTypeEnum.LIKE, icon: 'animated-icon-like-filled' },
    { reactionType: ReactionTypeEnum.DISLIKE, icon: 'animated-icon-like-filled' },
    { reactionType: ReactionTypeEnum.NO_REACTION, icon: 'animated-icon-like' },
  ])('should render correctly for $reactionType reaction', async ({ reactionType, icon }) => {
    render(
      <OfferReactionHeaderButton
        onPress={jest.fn()}
        animationState={ANIMATION_STATE_PROP}
        defaultReaction={reactionType}
      />
    )

    expect(await screen.findByTestId(icon)).toBeOnTheScreen()
  })
})
