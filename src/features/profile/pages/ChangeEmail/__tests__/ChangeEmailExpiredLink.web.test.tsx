import React from 'react'
import waitForExpect from 'wait-for-expect'

import { useAuthContext } from 'features/auth/AuthContext'
import { navigateToHome } from 'features/navigation/helpers'
import { ChangeEmailExpiredLink } from 'features/profile/pages/ChangeEmail/ChangeEmailExpiredLink'
import { fireEvent, render } from 'tests/utils/web'

jest.mock('features/navigation/helpers')

jest.mock('features/auth/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>
const mockUserLoggedOutOnce = () => {
  mockUseAuthContext.mockReturnValueOnce({ isLoggedIn: false, setIsLoggedIn: jest.fn() })
}

describe('<ChangeEmailExpiredLink />', () => {
  beforeEach(() => {
    mockUseAuthContext.mockReturnValue({ isLoggedIn: true, setIsLoggedIn: jest.fn() })
  })

  it('should render correctly', () => {
    const renderAPI = render(<ChangeEmailExpiredLink />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should render correctly when logged out', () => {
    mockUserLoggedOutOnce()

    const renderAPI = render(<ChangeEmailExpiredLink />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should redirect to home page when go back to home button is clicked', async () => {
    const { getByText } = await render(<ChangeEmailExpiredLink />)

    fireEvent.click(getByText(`Retourner à l'accueil`))

    await waitForExpect(() => {
      expect(navigateToHome).toBeCalledTimes(1)
    })
  })
})
