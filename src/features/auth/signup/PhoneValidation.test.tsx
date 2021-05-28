import React from 'react'
import { UseQueryResult } from 'react-query'
import { mocked } from 'ts-jest/utils'

import { SettingsResponse } from 'api/gen'
import { useAppSettings } from 'features/auth/settings'
import { PhoneValidation } from 'features/auth/signup/PhoneValidation'
import { render } from 'tests/utils'

jest.mock('react-query')

jest.mock('features/auth/settings')
const mockedUseAppSettings = mocked(useAppSettings, true)

describe('PhoneValidation', () => {
  it.each([
    ['', 'TRUE', { enablePhoneValidation: true }, true],
    ['NOT', 'FALSE', { enablePhoneValidation: false }, false],
    ['NOT', 'UNDEFINED', undefined, false],
  ])(
    'should %s show SetPhoneNumberModal if flag enablePhoneValidation is %s',
    (_should, _label, appSettingsData, expectedVisibility) => {
      const mockedAppSettingsValues = {
        data: appSettingsData,
      } as UseQueryResult<SettingsResponse, unknown>
      mockedUseAppSettings.mockReturnValueOnce(mockedAppSettingsValues)
      const { getAllByTestId } = render(<PhoneValidation />)

      const setPhoneNumberModal = getAllByTestId('modal')[0]
      expect(setPhoneNumberModal.props.visible).toBe(expectedVisibility)
    }
  )
})
