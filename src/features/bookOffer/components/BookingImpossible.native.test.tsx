import * as React from 'react'
import { useMutation } from 'react-query'
import { mocked } from 'ts-jest/utils'

import { fireEvent, render, useMutationFactory } from 'tests/utils'

import { BookingImpossible } from './BookingImpossible'

jest.mock('react-query')
const mockedUseMutation = mocked(useMutation)

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

const mockDismissModal = jest.fn()
jest.mock('features/bookOffer/context/useBookingContext', () => ({
  useBookingContext: jest.fn(() => ({
    bookingState: {
      offerId: 20,
      stockId: undefined,
      step: undefined,
      quantity: undefined,
      date: undefined,
    },
    dismissModal: mockDismissModal,
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

    const { getByText } = render(<BookingImpossible />)

    const addToFavoriteButton = getByText('Mettre en favoris')

    fireEvent.press(addToFavoriteButton)

    useMutationAddFavoriteCallbacks.onSuccess()
    expect(
      mockUseMutationNotifyWebappLinkSent(() => {}, {
        onSuccess: () => {},
        onError: () => {},
      }).mutate
    ).toHaveBeenCalledTimes(1)
  })
})
