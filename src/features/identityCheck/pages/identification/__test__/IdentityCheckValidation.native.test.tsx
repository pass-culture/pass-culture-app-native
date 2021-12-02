import { useEduConnect } from '@pass-culture/id-check'
import 'jest-styled-components/native'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { mocked } from 'ts-jest/dist/utils/testing'

import { useRoute } from '__mocks__/@react-navigation/native'
import { fireEvent, render } from 'tests/utils'

import { IdentityCheckValidation } from '../IdentityCheckValidation'

// eslint-disable-next-line react-hooks/rules-of-hooks
const { navigate } = useNavigation()
jest.mock('@pass-culture/id-check')
const mockedUseEduConnect = mocked(useEduConnect, true)
const flushPromises = new Promise(setImmediate)

describe('<IdentityCheckValidation />', () => {
  const firstName = 'John'
  const name = 'Doe'
  const birthDate = '28/01/1993'
  const countryCode = 'OK'
  const upload = jest.fn()

  beforeEach(() =>
    useRoute.mockImplementation(() => ({
      params: {},
    }))
  )

  it('should redirect to Stepper when logged in with EduConnect', async () => {
    const { getByText } = render(
      <IdentityCheckValidation
        firstName={firstName}
        name={name}
        birthDate={birthDate}
        countryCode="KO"
        upload={upload}
      />
    )
    const validateButton = getByText('Valider mes informations')
    fireEvent.press(validateButton)
    // wait for localStorage to have been updated
    await flushPromises
    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toHaveBeenCalledWith('initialRouteName')
  })

  it('should render IdentityCheckValidation component correctly', () => {
    const renderAPI = render(
      <IdentityCheckValidation
        firstName={firstName}
        name={name}
        birthDate={birthDate}
        countryCode={countryCode}
        upload={upload}
      />
    )
    expect(renderAPI).toMatchSnapshot()
  })

  it('should display user infos with props given', () => {
    const { getByText } = render(
      <IdentityCheckValidation
        firstName={firstName}
        name={name}
        birthDate={birthDate}
        countryCode={countryCode}
        upload={upload}
      />
    )
    expect(getByText('John')).toBeTruthy()
    expect(getByText('Doe')).toBeTruthy()
    expect(getByText('28/01/1993')).toBeTruthy()
  })

  it('should render a link redirect to Success view when country code is OK', () => {
    mockedUseEduConnect.mockReturnValueOnce(false)
    const { getByText } = render(
      <IdentityCheckValidation
        firstName={firstName}
        name={name}
        birthDate={birthDate}
        countryCode={countryCode}
        upload={upload}
      />
    )
    const validateButton = getByText('Valider mes informations')
    fireEvent.press(validateButton)
    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toHaveBeenCalledWith('Success')
  })

  it('should render a link redirect to Residence view when country code is KO', () => {
    mockedUseEduConnect.mockReturnValueOnce(false)

    const { getByText } = render(
      <IdentityCheckValidation
        firstName={firstName}
        name={name}
        birthDate={birthDate}
        countryCode="KO"
        upload={upload}
      />
    )
    const validateButton = getByText('Valider mes informations')
    fireEvent.press(validateButton)
    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toHaveBeenCalledWith('Residence')
  })
})
