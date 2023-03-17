import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { ShareAppWrapper } from 'features/share/context/ShareAppWrapper'
import { ShareAppModalType } from 'features/share/helpers/shareAppModalInformations'
import { BatchUser } from 'libs/react-native-batch'
import { render, fireEvent, waitFor } from 'tests/utils'

import { AccountCreated } from './AccountCreated'

jest.mock('features/profile/api/useResetRecreditAmountToShow')
jest.mock('features/navigation/helpers')
jest.mock('features/navigation/navigationRef')
jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.Mock

const mockShowAppModal = jest.fn()
jest.mock('features/share/context/ShareAppWrapper', () => ({
  ...jest.requireActual('features/share/context/ShareAppWrapper'),
  useShareAppContext: () => ({ showShareAppModal: mockShowAppModal }),
}))

describe('<AccountCreated />', () => {
  it('should render correctly', () => {
    const renderAPI = renderAccountCreated()
    expect(renderAPI).toMatchSnapshot()
  })

  it('should redirect to native cultural survey page WHEN "On y va !" button is clicked', async () => {
    const renderAPI = renderAccountCreated()

    fireEvent.press(renderAPI.getByText('On y va\u00a0!'))

    await waitFor(() => {
      expect(navigateFromRef).not.toBeCalled()
      expect(navigate).toBeCalledTimes(1)
      expect(navigate).toBeCalledWith('CulturalSurveyIntro', undefined)
    })
  })

  it('should redirect to home page WHEN "On y va !" button is clicked and user needs not to fill cultural survey', async () => {
    const { user: globalMockUser } = mockUseAuthContext()
    mockUseAuthContext.mockReturnValueOnce({
      user: { ...globalMockUser, needsToFillCulturalSurvey: false },
    })
    const renderAPI = renderAccountCreated()

    fireEvent.press(renderAPI.getByText('On y va\u00a0!'))

    await waitFor(() => {
      expect(navigateFromRef).toBeCalledWith(
        navigateToHomeConfig.screen,
        navigateToHomeConfig.params
      )
      expect(navigate).not.toBeCalledWith('CulturalSurvey', undefined)
    })
  })

  it('should track Batch event when "On y va !" button is clicked', async () => {
    const renderAPI = renderAccountCreated()

    fireEvent.press(await renderAPI.findByText('On y va\u00a0!'))

    expect(BatchUser.trackEvent).toBeCalledWith('has_validated_account')
  })

  it('should show non eligible share app modal when "On y va !" button is clicked', async () => {
    const renderAPI = renderAccountCreated()

    fireEvent.press(await renderAPI.findByText('On y va\u00a0!'))

    expect(mockShowAppModal).toHaveBeenNthCalledWith(1, ShareAppModalType.NOT_ELIGIBLE)
  })
})

const renderAccountCreated = () =>
  render(<AccountCreated />, {
    wrapper: ShareAppWrapper,
  })
