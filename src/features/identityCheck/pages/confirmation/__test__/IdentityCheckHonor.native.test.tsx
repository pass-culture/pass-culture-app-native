import React from 'react'
import { useMutation } from 'react-query'
import { mocked } from 'ts-jest/utils'

import { IdentityCheckHonor } from 'features/identityCheck/pages/confirmation/IdentityCheckHonor'
import { act, fireEvent, render, useMutationFactory } from 'tests/utils'

jest.mock('react-query')

const mockNavigateToNextScreen = jest.fn()
jest.mock('features/identityCheck/useIdentityCheckNavigation', () => ({
  useIdentityCheckNavigation: () => ({
    navigateToNextScreen: mockNavigateToNextScreen,
  }),
}))
const mockedUseMutation = mocked(useMutation)
const useMutationCallbacks: { onError: (error: unknown) => void; onSuccess: () => void } = {
  onSuccess: () => {},
  onError: () => {},
}

describe('<IdentityCheckHonor/>', () => {
  beforeEach(() => {
    // @ts-expect-error ts(2345)
    return mockedUseMutation.mockImplementation(useMutationFactory(useMutationCallbacks))
  })

  it('should render correctly', () => {
    const renderAPI = render(<IdentityCheckHonor />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should navigate to next screen on postHonorStatement request success', async () => {
    const renderAPI = render(<IdentityCheckHonor />)

    const button = renderAPI.getByTestId('Valider et continuer')
    fireEvent.press(button)

    await act(async () => {
      useMutationCallbacks.onSuccess()
    })
    expect(mockNavigateToNextScreen).toHaveBeenCalledTimes(1)
  })
})
