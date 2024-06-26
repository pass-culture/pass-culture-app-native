import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { ShareAppWrapper } from 'features/share/context/ShareAppWrapper'
import * as ShareAppWrapperModule from 'features/share/context/ShareAppWrapper'
import { ShareAppModalType } from 'features/share/types'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics'
import { BatchUser } from 'libs/react-native-batch'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { render, fireEvent, waitFor, screen } from 'tests/utils'

import { AccountCreated } from './AccountCreated'

jest.mock('features/profile/api/useResetRecreditAmountToShow')
jest.mock('features/navigation/helpers/navigateToHome')
jest.mock('features/navigation/navigationRef')
jest.mock('features/auth/context/AuthContext')

const mockShowAppModal = jest.fn()
jest
  .spyOn(ShareAppWrapperModule, 'useShareAppContext')
  .mockReturnValue({ showShareAppModal: mockShowAppModal })

describe('<AccountCreated />', () => {
  it('should render correctly', async () => {
    renderAccountCreated()

    await screen.findByText('Ton compte a été activé !')

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to native cultural survey page WHEN "On y va !" button is clicked', async () => {
    renderAccountCreated()

    fireEvent.press(await screen.findByLabelText('On y va\u00a0!'))

    await waitFor(() => {
      expect(navigateFromRef).not.toHaveBeenCalled()
      expect(navigate).toHaveBeenCalledTimes(1)
      expect(navigate).toHaveBeenCalledWith('CulturalSurveyIntro', undefined)
    })
  })

  it('should redirect to home page WHEN "On y va !" button is clicked and user needs not to fill cultural survey', async () => {
    mockAuthContextWithUser({ ...beneficiaryUser, needsToFillCulturalSurvey: false })
    mockAuthContextWithUser({ ...beneficiaryUser, needsToFillCulturalSurvey: false }) // re-render because local storage value has been read and set
    renderAccountCreated()

    fireEvent.press(await screen.findByLabelText('On y va\u00a0!'))

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

    fireEvent.press(await screen.findByLabelText('On y va\u00a0!'))

    expect(BatchUser.trackEvent).toHaveBeenCalledWith('has_validated_account')
  })

  it('should show non eligible share app modal when "On y va !" button is clicked', async () => {
    renderAccountCreated()

    fireEvent.press(await screen.findByLabelText('On y va\u00a0!'))

    expect(mockShowAppModal).toHaveBeenNthCalledWith(1, ShareAppModalType.NOT_ELIGIBLE)
  })

  it('should log analytics when "On y va !" button is clicked', async () => {
    renderAccountCreated()

    fireEvent.press(await screen.findByLabelText('On y va\u00a0!'))

    expect(analytics.logAccountCreatedStartClicked).toHaveBeenCalledTimes(1)
  })
})

const renderAccountCreated = () =>
  render(<AccountCreated />, {
    wrapper: ShareAppWrapper,
  })
