import React from 'react'

import { ReactionTypeEnum } from 'api/gen'
import { ReactionChoiceValidation } from 'features/reactions/components/ReactionChoiceValidation/ReactionChoiceValidation'
import { render, screen, userEvent } from 'tests/utils'

const user = userEvent.setup()
jest.useFakeTimers()

describe('ReactionChoiceValidation', () => {
  it('should display like and dislike buttons', () => {
    render(
      <ReactionChoiceValidation
        reactionStatus={ReactionTypeEnum.LIKE}
        handleOnPressReactionButton={jest.fn()}
        likeLabel="J’aime"
        dislikeLabel="Je n’aime pas"
      />
    )

    expect(screen.getByText('J’aime')).toBeOnTheScreen()
    expect(screen.getByText('Je n’aime pas')).toBeOnTheScreen()
  })

  it('should show filled thumb up and unfilled thumb down icons when like is active', () => {
    render(
      <ReactionChoiceValidation
        reactionStatus={ReactionTypeEnum.LIKE}
        handleOnPressReactionButton={jest.fn()}
        likeLabel="J’aime"
        dislikeLabel="Je n’aime pas"
      />
    )

    expect(screen.getByTestId('thumbUpFilled')).toBeOnTheScreen()
    expect(screen.getByTestId('thumbDown')).toBeOnTheScreen()
  })

  it('should trigger handleOnPressReactionButton when pressing like button', async () => {
    const mockHandleOnPress = jest.fn()
    render(
      <ReactionChoiceValidation
        reactionStatus={ReactionTypeEnum.DISLIKE}
        handleOnPressReactionButton={mockHandleOnPress}
        likeLabel="J’aime"
        dislikeLabel="Je n’aime pas"
      />
    )

    await user.press(screen.getByText('J’aime'))

    expect(mockHandleOnPress).toHaveBeenCalledWith(ReactionTypeEnum.LIKE)
  })
})
