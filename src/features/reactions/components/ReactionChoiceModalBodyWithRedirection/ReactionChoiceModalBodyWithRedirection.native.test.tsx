import React from 'react'

import { CategoryIdEnum } from 'api/gen'
import { ReactionChoiceModalBodyWithRedirection } from 'features/reactions/components/ReactionChoiceModalBodyWithRedirection/ReactionChoiceModalBodyWithRedirection'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, screen } from 'tests/utils'

describe('ReactionChoiceModalBodyWithRedirection', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

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

  it('should display thumbs image when there are not offer booked with an image', () => {
    render(
      <ReactionChoiceModalBodyWithRedirection
        offerImages={[{ imageUrl: '', categoryId: CategoryIdEnum.CINEMA }]}
      />
    )

    expect(screen.getByTestId('thumbsImage')).toBeOnTheScreen()
  })

  it('should not display thumbs image when there is at least one offer booked with an image', () => {
    render(
      <ReactionChoiceModalBodyWithRedirection
        offerImages={[{ imageUrl: 'url', categoryId: CategoryIdEnum.CINEMA }]}
      />
    )

    expect(screen.queryByTestId('thumbsImage')).not.toBeOnTheScreen()
  })

  it('should display offer images gradient when there are more than 4 images', () => {
    render(
      <ReactionChoiceModalBodyWithRedirection
        offerImages={[
          { imageUrl: 'url1', categoryId: CategoryIdEnum.CINEMA },
          { imageUrl: 'url2', categoryId: CategoryIdEnum.CINEMA },
          { imageUrl: 'url3', categoryId: CategoryIdEnum.CINEMA },
          { imageUrl: 'url4', categoryId: CategoryIdEnum.CINEMA },
          { imageUrl: 'url5', categoryId: CategoryIdEnum.CINEMA },
        ]}
      />
    )

    expect(screen.getByTestId('offerImagesGradient')).toBeOnTheScreen()
  })

  it('should display offer images gradient when there are 4 of less images', () => {
    render(
      <ReactionChoiceModalBodyWithRedirection
        offerImages={[
          { imageUrl: 'url1', categoryId: CategoryIdEnum.CINEMA },
          { imageUrl: 'url2', categoryId: CategoryIdEnum.CINEMA },
          { imageUrl: 'url3', categoryId: CategoryIdEnum.CINEMA },
          { imageUrl: 'url4', categoryId: CategoryIdEnum.CINEMA },
        ]}
      />
    )

    expect(screen.queryByTestId('offerImagesGradient')).not.toBeOnTheScreen()
  })

  it('should display remote illustration when new vision UI FF activated', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_NEW_VISION_UI])

    render(
      <ReactionChoiceModalBodyWithRedirection
        offerImages={[{ imageUrl: '', categoryId: CategoryIdEnum.CINEMA }]}
      />
    )

    expect(screen.getByTestId('remote-illustration')).toBeOnTheScreen()
  })
})
