import React from 'react'

import { ReactionTypeEnum } from 'api/gen'
import { ReactionChoiceValidation } from 'features/reactions/components/ReactionChoiceValidation/ReactionChoiceValidation'
import { fireEvent, render, screen } from 'tests/utils'

describe('ReactionChoiceValidation', () => {
  it('should display like and dislike buttons', () => {
    render(
      <ReactionChoiceValidation
        reactionStatus={ReactionTypeEnum.LIKE}
        handleOnPressReactionButton={jest.fn()}
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
      />
    )

    expect(screen.getByTestId('thumbUpFilled')).toBeOnTheScreen()
    expect(screen.getByTestId('thumbDown')).toBeOnTheScreen()
  })

  it('should trigger handleOnPressReactionButton when pressing like button', () => {
    const mockHandleOnPress = jest.fn()
    render(
      <ReactionChoiceValidation
        reactionStatus={ReactionTypeEnum.DISLIKE}
        handleOnPressReactionButton={mockHandleOnPress}
      />
    )

    fireEvent.press(screen.getByText('J’aime'))

    expect(mockHandleOnPress).toHaveBeenCalledWith(ReactionTypeEnum.LIKE)
  })
})
