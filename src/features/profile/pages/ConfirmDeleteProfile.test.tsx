import React from 'react'
import { UseQueryResult } from 'react-query'

import { navigate } from '__mocks__/@react-navigation/native'
import { goBack } from '__mocks__/@react-navigation/native'
import { UserProfileResponse } from 'api/gen'
import { contactSupport } from 'features/auth/support.services'
import { fireEvent, render } from 'tests/utils'

import { ConfirmDeleteProfile } from './ConfirmDeleteProfile'

jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(
    () =>
      ({
        isLoading: false,
        data: { email: 'email2@domain.ext', firstName: 'Jean', isBeneficiary: false },
      } as UseQueryResult<UserProfileResponse>)
  ),
}))

describe('ConfirmDeleteProfile component', () => {
  it('should render confirm delete profile', () => {
    const renderAPI = render(<ConfirmDeleteProfile />)
    expect(renderAPI.toJSON()).toMatchSnapshot()
  })

  it('should open mail app when clicking on "Je supprime mon compte" button', () => {
    const renderAPI = render(<ConfirmDeleteProfile />)
    fireEvent.press(renderAPI.getByText(`Je supprime mon compte`))
    expect(contactSupport.forAccountDeletion).toBeCalledWith('email2@domain.ext')
  })

  it('should redirect to LegalNotices when clicking on "Abandonner" button', () => {
    const renderAPI = render(<ConfirmDeleteProfile />)
    fireEvent.press(renderAPI.getByText(`Abandonner`))
    expect(goBack).toBeCalled()
    expect(navigate).toBeCalledWith('LegalNotices')
  })
})
