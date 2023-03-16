import * as React from 'react'
import { useMutation } from 'react-query'

import { initialBookingState, Step } from 'features/bookOffer/context/reducer'
import { fireEvent, render, screen, useMutationFactory } from 'tests/utils'

import { BookingImpossible } from './BookingImpossible'

jest.mock('react-query')
const mockedUseMutation = jest.mocked(useMutation)

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

const mockInitialBookingState = initialBookingState

const mockDismissModal = jest.fn()
const mockDispatch = jest.fn()
jest.mock('features/bookOffer/context/useBookingContext', () => ({
  useBookingContext: jest.fn(() => ({
    bookingState: { ...mockInitialBookingState, offerId: 20 },
    dismissModal: mockDismissModal,
    dispatch: mockDispatch,
  })),
}))

describe('<BookingImpossible />', () => {
  it('should call notifyWebappLinkSent when adding to favorites', async () => {
    const useMutationAddFavoriteCallbacks: Parameters<typeof useMutationFactory>[0] = {
      onSuccess: () => {},
      onError: () => {},
    }
    const useMutationNotifyWebappLinkSentCallbacks: Parameters<typeof useMutationFactory>[0] = {
      onSuccess: () => {},
      onError: () => {},
    }

    const mockUseMutationNotifyWebappLinkSent = useMutationFactory(
      useMutationNotifyWebappLinkSentCallbacks
    )

    mockedUseMutation
      // @ts-expect-error ts(2345)
      .mockImplementationOnce(mockUseMutationNotifyWebappLinkSent)
      // @ts-expect-error ts(2345)
      .mockImplementationOnce(useMutationFactory(useMutationAddFavoriteCallbacks))

    render(<BookingImpossible />)

    const addToFavoriteButton = screen.getByText('Mettre en favoris')

    fireEvent.press(addToFavoriteButton)

    useMutationAddFavoriteCallbacks.onSuccess()
    expect(
      mockUseMutationNotifyWebappLinkSent(() => {}, {
        onSuccess: () => {},
        onError: () => {},
      }).mutate
    ).toHaveBeenCalledTimes(1)
  })

  it('should change booking step from date to confirmation', () => {
    render(<BookingImpossible />)
    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
      type: 'CHANGE_STEP',
      payload: Step.CONFIRMATION,
    })
  })
})
