import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { fireEvent, render } from 'tests/utils'

import { IdentityCheckValidation } from '../IdentityCheckValidation'

const mockNavigateToNextScreen = jest.fn()
jest.mock('features/identityCheck/useIdentityCheckNavigation', () => ({
  useIdentityCheckNavigation: () => ({
    navigateToNextScreen: mockNavigateToNextScreen,
  }),
}))

const mockDispatch = jest.fn()
jest.mock('features/identityCheck/context/IdentityCheckContextProvider', () => ({
  useIdentityCheckContext: () => ({
    dispatch: mockDispatch,
    identification: {
      done: false,
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '1993-01-28',
      method: null,
    },
  }),
}))

const flushPromises = new Promise(setImmediate)

describe('<IdentityCheckValidation />', () => {
  beforeEach(() =>
    useRoute.mockImplementation(() => ({
      params: {},
    }))
  )

  it('should redirect to Stepper when logged in with EduConnect', async () => {
    const { getByText } = render(<IdentityCheckValidation />)
    const validateButton = getByText('Valider mes informations')
    fireEvent.press(validateButton)
    // wait for localStorage to have been updated
    await flushPromises
    expect(mockNavigateToNextScreen).toBeCalledTimes(1)
    expect(mockNavigateToNextScreen).toHaveBeenCalledWith()
    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
      payload: IdentityCheckStep.CONFIRMATION,
      type: 'SET_STEP',
    })
  })

  it('should render IdentityCheckValidation component correctly', () => {
    const renderAPI = render(<IdentityCheckValidation />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should display user infos with props given', () => {
    const { getByText } = render(<IdentityCheckValidation />)
    expect(getByText('John')).toBeTruthy()
    expect(getByText('Doe')).toBeTruthy()
    expect(getByText('28/01/1993')).toBeTruthy()
  })
})
