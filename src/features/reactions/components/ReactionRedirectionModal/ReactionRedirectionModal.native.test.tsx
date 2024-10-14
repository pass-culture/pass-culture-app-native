import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { CategoryIdEnum } from 'api/gen'
import { BookingsTab } from 'features/bookings/enum'
import { ReactionRedirectionModal } from 'features/reactions/components/ReactionRedirectionModal/ReactionRedirectionModal'
import { fireEvent, render, screen } from 'tests/utils'

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const mockCloseModal = jest.fn()

describe('ReactionChoiceModalBodyWithRedirection', () => {
  it('should close the modal when pressing close icon', () => {
    render(
      <ReactionRedirectionModal
        visible
        offerImages={[{ imageUrl: 'url', categoryId: CategoryIdEnum.CINEMA }]}
        closeModal={mockCloseModal}
      />
    )

    fireEvent.press(screen.getByTestId('Fermer la modale'))

    expect(mockCloseModal).toHaveBeenCalledTimes(1)
  })

  it('should close the modal when pressing "Plus tard" button', () => {
    render(
      <ReactionRedirectionModal
        visible
        offerImages={[{ imageUrl: 'url', categoryId: CategoryIdEnum.CINEMA }]}
        closeModal={mockCloseModal}
      />
    )

    fireEvent.press(screen.getByText('Plus tard'))

    expect(mockCloseModal).toHaveBeenCalledTimes(1)
  })

  it('should redirect to ended bookings when pressing "Donner mon avis" button', () => {
    render(
      <ReactionRedirectionModal
        visible
        offerImages={[{ imageUrl: 'url', categoryId: CategoryIdEnum.CINEMA }]}
        closeModal={jest.fn()}
      />
    )

    fireEvent.press(screen.getByText('Donner mon avis'))

    expect(navigate).toHaveBeenNthCalledWith(1, 'Bookings', {
      activeTab: BookingsTab.COMPLETED,
    })
  })

  it('should close the modal when pressing "Donner mon avis" button', () => {
    render(
      <ReactionRedirectionModal
        visible
        offerImages={[{ imageUrl: 'url', categoryId: CategoryIdEnum.CINEMA }]}
        closeModal={mockCloseModal}
      />
    )

    fireEvent.press(screen.getByText('Donner mon avis'))

    expect(mockCloseModal).toHaveBeenCalledTimes(1)
  })

  it('should display image container when there is at least one offer booked with an image', () => {
    render(
      <ReactionRedirectionModal
        visible
        offerImages={[{ imageUrl: 'url', categoryId: CategoryIdEnum.CINEMA }]}
        closeModal={jest.fn()}
      />
    )

    expect(screen.getByTestId('imagesContainer')).toBeOnTheScreen()
  })

  it('should not display image container when there are not offer booked with an image', () => {
    render(
      <ReactionRedirectionModal
        visible
        offerImages={[{ imageUrl: '', categoryId: CategoryIdEnum.CINEMA }]}
        closeModal={jest.fn()}
      />
    )

    expect(screen.queryByTestId('imagesContainer')).not.toBeOnTheScreen()
  })

  it('should display thumbs image when there are not offer booked with an image', () => {
    render(
      <ReactionRedirectionModal
        visible
        offerImages={[{ imageUrl: '', categoryId: CategoryIdEnum.CINEMA }]}
        closeModal={jest.fn()}
      />
    )

    expect(screen.getByTestId('thumbsImage')).toBeOnTheScreen()
  })

  it('should not display thumbs image when there is at least one offer booked with an image', () => {
    render(
      <ReactionRedirectionModal
        visible
        offerImages={[{ imageUrl: 'url', categoryId: CategoryIdEnum.CINEMA }]}
        closeModal={jest.fn()}
      />
    )

    expect(screen.queryByTestId('thumbsImage')).not.toBeOnTheScreen()
  })

  it('should display offer images gradient when there are more than 4 images', () => {
    render(
      <ReactionRedirectionModal
        visible
        offerImages={[
          { imageUrl: 'url1', categoryId: CategoryIdEnum.CINEMA },
          { imageUrl: 'url2', categoryId: CategoryIdEnum.CINEMA },
          { imageUrl: 'url3', categoryId: CategoryIdEnum.CINEMA },
          { imageUrl: 'url4', categoryId: CategoryIdEnum.CINEMA },
          { imageUrl: 'url5', categoryId: CategoryIdEnum.CINEMA },
        ]}
        closeModal={jest.fn()}
      />
    )

    expect(screen.getByTestId('offerImagesGradient')).toBeOnTheScreen()
  })

  it('should display offer images gradient when there are 4 of less images', () => {
    render(
      <ReactionRedirectionModal
        visible
        offerImages={[
          { imageUrl: 'url1', categoryId: CategoryIdEnum.CINEMA },
          { imageUrl: 'url2', categoryId: CategoryIdEnum.CINEMA },
          { imageUrl: 'url3', categoryId: CategoryIdEnum.CINEMA },
          { imageUrl: 'url4', categoryId: CategoryIdEnum.CINEMA },
        ]}
        closeModal={jest.fn()}
      />
    )

    expect(screen.queryByTestId('offerImagesGradient')).not.toBeOnTheScreen()
  })
})
