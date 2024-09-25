import React from 'react'

import { CategoryIdEnum } from 'api/gen'
import { ReactionChoiceModalBodyWithRedirection } from 'features/reactions/components/ReactionChoiceModalBodyWithRedirection/ReactionChoiceModalBodyWithRedirection'
import { render, screen } from 'tests/utils'

describe('ReactionChoiceModalBodyWithRedirection', () => {
  it('should display image container when there is at least one offer booked with an image', () => {
    render(
      <ReactionChoiceModalBodyWithRedirection
        offerImages={[{ imageUrl: 'url', categoryId: CategoryIdEnum.CINEMA }]}
      />
    )

    expect(screen.getByTestId('imagesContainer')).toBeOnTheScreen()
  })

  it('should not display image container when there are not offer booked with an image', () => {
    render(
      <ReactionChoiceModalBodyWithRedirection
        offerImages={[{ imageUrl: '', categoryId: CategoryIdEnum.CINEMA }]}
      />
    )

    expect(screen.queryByTestId('imagesContainer')).not.toBeOnTheScreen()
  })
})
