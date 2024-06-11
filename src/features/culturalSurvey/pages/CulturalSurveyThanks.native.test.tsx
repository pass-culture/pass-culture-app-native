import React from 'react'

import { reset } from '__mocks__/@react-navigation/native'
import { CulturalSurveyThanks } from 'features/culturalSurvey/pages/CulturalSurveyThanks'
import * as ShareAppWrapperModule from 'features/share/context/ShareAppWrapper'
import { ShareAppModalType } from 'features/share/types'
import { storage } from 'libs/storage'
import { render, fireEvent, screen, act } from 'tests/utils'

jest.mock('features/navigation/helpers/navigateToHome')
const mockShowAppModal = jest.fn()
jest
  .spyOn(ShareAppWrapperModule, 'useShareAppContext')
  .mockReturnValue({ showShareAppModal: mockShowAppModal })

const SHARE_APP_MODAL_STORAGE_KEY = 'has_seen_share_app_modal'

describe('CulturalSurveyThanksPage page', () => {
  beforeEach(() => {
    storage.clear(SHARE_APP_MODAL_STORAGE_KEY)
  })

  it('should render the page with correct layout', () => {
    render(<CulturalSurveyThanks />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to home when pressing Découvrir le catalogue', () => {
    render(<CulturalSurveyThanks />)
    const DiscoverButton = screen.getByTestId('Découvrir le catalogue')
    fireEvent.press(DiscoverButton)

    expect(reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'TabNavigator' }],
    })
  })

  it('should show ShareAppModal when pressing Découvrir le catalogue', async () => {
    render(<CulturalSurveyThanks />)

    const discoverButton = screen.getByText('Découvrir le catalogue')
    await act(() => {
      fireEvent.press(discoverButton)
    })

    expect(mockShowAppModal).toHaveBeenNthCalledWith(1, ShareAppModalType.BENEFICIARY)
  })

  it('should not show ShareAppModal when ShareAppModal already shown', async () => {
    storage.saveObject(SHARE_APP_MODAL_STORAGE_KEY, true)

    render(<CulturalSurveyThanks />)
    const discoverButton = screen.getByText('Découvrir le catalogue')
    await act(() => {
      fireEvent.press(discoverButton)
    })

    expect(mockShowAppModal).not.toHaveBeenCalled()
  })

  it('should save that ShareAppModal was shown in storage', async () => {
    render(<CulturalSurveyThanks />)
    const discoverButton = screen.getByText('Découvrir le catalogue')
    await act(() => {
      fireEvent.press(discoverButton)
    })

    const hasSeenShareAppModal = await storage.readObject(SHARE_APP_MODAL_STORAGE_KEY)

    expect(hasSeenShareAppModal).toBe(true)
  })
})
