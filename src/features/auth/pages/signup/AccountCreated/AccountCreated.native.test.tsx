import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { ShareAppWrapper } from 'features/share/context/ShareAppWrapper'
import { ShareAppModalType } from 'features/share/helpers/shareAppModalInformations'
import { analytics } from 'libs/analytics'
import { BatchUser } from 'libs/react-native-batch'
import { render, fireEvent, waitFor, screen } from 'tests/utils'

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
    renderAccountCreated()

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to native cultural survey page WHEN "On y va !" button is clicked', async () => {
    renderAccountCreated()

    fireEvent.press(screen.getByText('On y va\u00a0!'))

    await waitFor(() => {
      expect(navigateFromRef).not.toHaveBeenCalled()
      expect(navigate).toHaveBeenCalledTimes(1)
      expect(navigate).toHaveBeenCalledWith('CulturalSurveyIntro', undefined)
    })
  })

  it('should redirect to home page WHEN "On y va !" button is clicked and user needs not to fill cultural survey', async () => {
    const { user: globalMockUser } = mockUseAuthContext()
    mockUseAuthContext.mockReturnValueOnce({
      user: { ...globalMockUser, needsToFillCulturalSurvey: false },
    })
    renderAccountCreated()

    fireEvent.press(screen.getByText('On y va\u00a0!'))

    await waitFor(() => {
      expect(navigateFromRef).toHaveBeenCalledWith(
        navigateToHomeConfig.screen,
        navigateToHomeConfig.params
      )
      expect(navigate).not.toHaveBeenCalledWith('CulturalSurvey', undefined)
    })
  })

  it('should track Batch event when "On y va !" button is clicked', async () => {
    renderAccountCreated()

    fireEvent.press(await screen.findByText('On y va\u00a0!'))

    expect(BatchUser.trackEvent).toHaveBeenCalledWith('has_validated_account')
  })

  it('should show non eligible share app modal when "On y va !" button is clicked', async () => {
    renderAccountCreated()

    fireEvent.press(await screen.findByText('On y va\u00a0!'))

    expect(mockShowAppModal).toHaveBeenNthCalledWith(1, ShareAppModalType.NOT_ELIGIBLE)
  })

  it('should log analytics when "On y va !" button is clicked', async () => {
    renderAccountCreated()

    fireEvent.press(await screen.findByText('On y va\u00a0!'))

    expect(analytics.logAccountCreatedStartClicked).toHaveBeenCalledTimes(1)
  })
})

const renderAccountCreated = () =>
  render(<AccountCreated />, {
    wrapper: ShareAppWrapper,
  })
