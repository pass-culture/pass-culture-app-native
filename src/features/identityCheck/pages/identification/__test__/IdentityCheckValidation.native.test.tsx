import 'jest-styled-components/native'
import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { useIdentityCheckNavigation } from 'features/identityCheck/useIdentityCheckNavigation'
import { fireEvent, render } from 'tests/utils'

import { IdentityCheckValidation } from '../IdentityCheckValidation'

// eslint-disable-next-line react-hooks/rules-of-hooks
const { navigateToNextScreen } = useIdentityCheckNavigation()
// eslint-disable-next-line react-hooks/rules-of-hooks
const { dispatch } = useIdentityCheckContext()
jest.mock('@pass-culture/id-check')
jest.mock('features/identityCheck/context/IdentityCheckContextProvider')
jest.mock('features/identityCheck/useIdentityCheckNavigation')

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
    expect(navigateToNextScreen).toBeCalledTimes(1)
    expect(navigateToNextScreen).toHaveBeenCalledWith()
    expect(dispatch).toBeCalledTimes(1)
    expect(dispatch).toHaveBeenCalledWith({
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
