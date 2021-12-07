import 'jest-styled-components/native'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { mocked } from 'ts-jest/dist/utils/testing'

import { useRoute } from '__mocks__/@react-navigation/native'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { useIdentityCheckNavigation } from 'features/identityCheck/useIdentityCheckNavigation'
import { useEduconnect } from 'features/identityCheck/utils/useEduConnect'
import { fireEvent, render } from 'tests/utils'

import { IdentityCheckValidation } from '../IdentityCheckValidation'

// eslint-disable-next-line react-hooks/rules-of-hooks
const { navigate } = useNavigation()
// eslint-disable-next-line react-hooks/rules-of-hooks
const { navigateToNextScreen } = useIdentityCheckNavigation()
// eslint-disable-next-line react-hooks/rules-of-hooks
const { dispatch, identification } = useIdentityCheckContext()
jest.mock('@pass-culture/id-check')
const mockedUseEduConnect = mocked(useEduconnect, true)
jest.mock('features/identityCheck/context/IdentityCheckContextProvider')
const mockedUseIdentityCheckContext = useIdentityCheckContext as jest.Mock
jest.mock('features/identityCheck/useIdentityCheckNavigation')
jest.mock('features/identityCheck/utils/useEduConnect')

const flushPromises = new Promise(setImmediate)

describe('<IdentityCheckValidation />', () => {
  const upload = jest.fn()

  beforeEach(() =>
    useRoute.mockImplementation(() => ({
      params: {},
    }))
  )

  it('should redirect to Stepper when logged in with EduConnect', async () => {
    const { getByText } = render(<IdentityCheckValidation upload={upload} />)
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
    const renderAPI = render(<IdentityCheckValidation upload={upload} />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should display user infos with props given', () => {
    const { getByText } = render(<IdentityCheckValidation upload={upload} />)
    expect(getByText('John')).toBeTruthy()
    expect(getByText('Doe')).toBeTruthy()
    expect(getByText('28/01/1993')).toBeTruthy()
  })

  it('should render a link redirect to Success view when country code is OK', () => {
    mockedUseEduConnect.mockReturnValueOnce({ shouldUseEduConnect: false })
    const { getByText } = render(<IdentityCheckValidation upload={upload} />)
    const validateButton = getByText('Valider mes informations')
    fireEvent.press(validateButton)
    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toHaveBeenCalledWith('Success')
  })

  it('should render a link redirect to Residence view when country code is KO', () => {
    mockedUseEduConnect.mockReturnValueOnce({ shouldUseEduConnect: false })
    mockedUseIdentityCheckContext.mockReturnValueOnce({
      dispatch,
      identification: { ...identification, countryCode: 'KO' },
    })

    const { getByText } = render(<IdentityCheckValidation upload={upload} />)
    const validateButton = getByText('Valider mes informations')
    fireEvent.press(validateButton)
    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toHaveBeenCalledWith('Residence')
  })
})
